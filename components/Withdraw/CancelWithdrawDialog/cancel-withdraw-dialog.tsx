import { TokenIcon } from '@/components/config/tokenIcons'
import { TxAnimationWrapper } from '@/components/global/tx-animation-wrapper'
import ErrorCodeBlock from '@/components/global/tx-dialog/error-code-block'
import TxSteps from '@/components/global/tx-steps'
import { atomicQueueContractAddress } from '@/config/constants'
import { useChainManagement } from '@/hooks/useChainManagement'
import { useUpdateAtomicRequestMutation } from '@/store/slices/atomicQueueApi'
import { useWaitForTransactionReceiptQuery } from '@/store/slices/transactionReceiptApt'
import { Order } from '@/types/Order'
import { TokenKey } from '@/types/TokenKey'
import { prepareAtomicRequestData } from '@/utils/atomicRequest'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react'
import { ArrowRight, Eye, EyeOff, Minus, Undo2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { formatUnits } from 'viem'
import CancelWithdrawDialogBody from './cancel-withdraw-dialog-body'

interface CancelWithdrawDialogProps {
  isOpen: boolean
  onClose: () => void
  order: Order
}

function CancelWithdrawDialog({ isOpen, onClose, order }: CancelWithdrawDialogProps) {
  // TODO: Update to use TansStack Query moving forward
  const [
    updateAtomicRequest,
    {
      error: cancelMutationError,
      data: cancelMutationData,
      isLoading: isCancelMutationLoading,
      isUninitialized,
      isError: isCancelMutationError,
      isSuccess: isCancelMutationSuccess,
      status: cancelMutationStatus,
    },
  ] = useUpdateAtomicRequestMutation({
    fixedCacheKey: 'cancel-withdraw',
  })
  const { switchToChain } = useChainManagement()
  // TODO: Update to use TansStack Query moving forward
  const {
    data: txReceipt,
    error: txReceiptError,
    status: txReceiptStatus,
    isLoading: isTxReceiptLoading,
    isError: isTxReceiptError,
    isSuccess: isTxReceiptSuccess,
    isFetching: isTxReceiptFetching,
    isUninitialized: isTxReceiptUninitialized,
  } = useWaitForTransactionReceiptQuery({ hash: cancelMutationData! }, { skip: !cancelMutationData })
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [isFullErrorDisplayed, setIsFullErrorDisplayed] = useState(false)
  if (!order) return null
  const {
    amount,
    status,
    offer_token,
    want_token,
    atomic_price,
    deadline,
    created_timestamp,
    ending_timestamp,
    created_log_index,
    created_transaction_index,
    created_block_number,
    ending_log_index,
    ending_transaction_index,
    ending_block_number,
    queue_address,
    chain_id,
    offer_amount_spent,
    want_amount_rec,
    created_transaction_hash,
    ending_transaction_hash,
  } = order
  console.table(order)

  const offerTokenKey = getSymbolByAddress(offer_token)?.toLowerCase() as TokenKey
  // * We might need this to display what the want token was
  const wantTokenKey = getSymbolByAddress(want_token)?.toLowerCase() as TokenKey
  // Request Data
  const atomicPriceAsNumber = Number(formatUnits(BigInt(atomic_price), 18))
  const amountAsNumber = Number(formatUnits(BigInt(amount), 18))
  const minimumPrice = atomicPriceAsNumber * amountAsNumber

  // Fulfillment Data
  const offerAmountSpentAsNumber = Number(formatUnits(BigInt(offer_amount_spent), 18))
  const wantAmountRecAsNumber = Number(formatUnits(BigInt(want_amount_rec), 18))
  const filledPrice = offerAmountSpentAsNumber / wantAmountRecAsNumber

  const handleCancelOrder = () => {
    switchToChain(chain_id)
    const { atomicRequestArgs, atomicRequestOptions } = prepareAtomicRequestData(
      Number(deadline), // Convert string to number
      BigInt(atomic_price),
      BigInt(0), // shares amount set to zero to cancel order
      offer_token,
      want_token,
      atomicQueueContractAddress,
      chain_id // destination chain id
    )

    updateAtomicRequest({
      atomicRequestArg: atomicRequestArgs,
      atomicRequestOptions: atomicRequestOptions,
    })
  }

  console.log(
    'mutation',
    isCancelMutationLoading,
    isUninitialized,
    isCancelMutationError,
    cancelMutationData,
    cancelMutationError
  )
  console.log(
    'tx receipt',
    isTxReceiptLoading,
    isTxReceiptFetching,
    isTxReceiptUninitialized,
    isTxReceiptError,
    isTxReceiptSuccess,
    txReceipt
  )

  const handleToggleDisplayFullError = () => {
    setIsFullErrorDisplayed(!isFullErrorDisplayed)
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius="2xl" bg="bg.white" minWidth={'452px'}>
          <AlertDialogHeader fontFamily="diatype" pt={6} fontSize="xl" fontWeight="medium">
            Cancel Withdrawal
          </AlertDialogHeader>
          {isUninitialized && (
            <>
              <CancelWithdrawDialogBody
                offerTokenKey={offerTokenKey}
                offer_amount_spent={offer_amount_spent}
                offer_token={offer_token}
                want_token={want_token}
                deadline={deadline}
                created_timestamp={created_timestamp}
                atomicPriceAsNumber={atomicPriceAsNumber}
                minimumPrice={minimumPrice}
                amount={amount}
                status={status}
              />
            </>
          )}
          {!isUninitialized && (
            <AlertDialogBody display="flex" flexDirection="column" gap={6}>
              {!isFullErrorDisplayed && (
                <TxAnimationWrapper
                  isError={isCancelMutationError || isTxReceiptError}
                  isLoading={isCancelMutationLoading || isTxReceiptLoading}
                  isSuccess={isCancelMutationSuccess || isTxReceiptSuccess}
                  loop
                  autoplay
                />
              )}
              {!isCancelMutationError && !isTxReceiptError && !isTxReceiptSuccess && (
                <TxSteps
                  steps={[
                    { title: 'Awaiting wallet signature', status: cancelMutationStatus },
                    { title: 'Pending Confirmation', status: txReceiptStatus },
                  ]}
                />
              )}
              {isTxReceiptSuccess && (
                <Flex flexDirection="column" alignItems="center" gap={4}>
                  <Flex gap={2} justifyContent="center" alignItems="center">
                    <TokenIcon fontSize="24px" tokenKey={offerTokenKey} />
                    <Text as="h1" fontFamily="ppformula" fontSize="xl" fontWeight="medium">{`${bigIntToNumberAsString(
                      BigInt(amount),
                      {
                        decimals: 18,
                        maximumFractionDigits: 2,
                      }
                    )} ${getSymbolByAddress(offer_token)}`}</Text>
                    <Icon as={ArrowRight} size={16} color="element.subdued" strokeWidth={1.5} />
                    <Icon as={Minus} size={20} color="element.main" strokeWidth={1} />
                  </Flex>
                  <Text fontFamily="diatype" fontSize="xl" fontWeight="normal" textAlign="center" color="element.main">
                    Transaction cancelled with success.
                  </Text>
                </Flex>
              )}
              {(isCancelMutationError || isTxReceiptError) && (
                <Flex flexDirection="column" alignItems="center" gap={4}>
                  {!isFullErrorDisplayed && (
                    <>
                      <Heading as="h1" fontFamily="ppformula" fontSize="2xl" fontWeight="medium">
                        Transaction Error
                      </Heading>
                      <Text
                        fontFamily="diatype"
                        fontSize="xl"
                        fontWeight="normal"
                        textAlign="center"
                        color="element.main"
                      >
                        If this is unexpected, please reach out to the team through the{' '}
                        <Link
                          textDecoration="underline"
                          isExternal
                          href="https://discord.gg/wPRjEwa4xw"
                          color="element.main"
                        >
                          discord
                        </Link>{' '}
                        support ticket.
                      </Text>
                    </>
                  )}
                  {isFullErrorDisplayed && (
                    <ErrorCodeBlock
                      error={isCancelMutationError ? (cancelMutationError as string) : (txReceiptError as string)}
                    />
                  )}
                  <Button
                    fontFamily="diatype"
                    fontWeight="normal"
                    variant="link"
                    color="crystal.600"
                    onClick={handleToggleDisplayFullError}
                    rightIcon={
                      isFullErrorDisplayed ? (
                        <EyeOff size={18} strokeWidth={1.5} />
                      ) : (
                        <Eye size={18} strokeWidth={1.5} />
                      )
                    }
                  >
                    {isFullErrorDisplayed ? 'Hide Details' : 'Expand for details'}
                  </Button>
                </Flex>
              )}
            </AlertDialogBody>
          )}
          <AlertDialogFooter display="flex" flexDirection="column" gap={2}>
            {isUninitialized && (
              <>
                <Button
                  onClick={handleCancelOrder}
                  fontFamily="diatype"
                  fontWeight="normal"
                  width="100%"
                  colorScheme="red"
                  background={'red.500'}
                  _hover={{ background: 'red.400' }}
                  _active={{ background: 'red.600' }}
                >
                  Cancel
                </Button>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  fontFamily="diatype"
                  fontWeight="normal"
                  color="element.subdued"
                  _hover={{ background: 'bg.secondary' }}
                  width="100%"
                  variant="ghost"
                  rightIcon={<Undo2 size={16} strokeWidth={1.5} />}
                >
                  Go Back
                </Button>
              </>
            )}
            {(isCancelMutationError || isTxReceiptError || isTxReceiptSuccess) && (
              <Button onClick={onClose} fontFamily="diatype" fontWeight="normal" width="100%">
                Close
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default CancelWithdrawDialog
