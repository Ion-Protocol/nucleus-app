import { TokenIcon } from '@/components/config/tokenIcons'
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
  Text,
} from '@chakra-ui/react'
import { ArrowRight, Undo2 } from 'lucide-react'
import { useRef } from 'react'
import { formatUnits } from 'viem'
import RequestDetails from '../WithdrawalDetailModal/RequestDetails'

interface CancelWithdrawDialogProps {
  isOpen: boolean
  onClose: () => void
  order: Order
}

function CancelWithdrawDialog({ isOpen, onClose, order }: CancelWithdrawDialogProps) {
  const [updateAtomicRequest, { isLoading, isUninitialized, isError, error, data }] = useUpdateAtomicRequestMutation({
    fixedCacheKey: 'cancel-withdraw',
  })
  const { switchToChain } = useChainManagement()
  const {
    data: txReceipt,
    isLoading: isTxReceiptLoading,
    isError: isTxReceiptError,
    isSuccess: isTxReceiptSuccess,
    isFetching: isTxReceiptFetching,
    isUninitialized: isTxReceiptUninitialized,
  } = useWaitForTransactionReceiptQuery({ hash: data! }, { skip: !data })
  const cancelRef = useRef<HTMLButtonElement>(null)
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
      1 // destination chain id
    )

    updateAtomicRequest({
      atomicRequestArg: atomicRequestArgs,
      atomicRequestOptions: atomicRequestOptions,
    })
  }

  console.log('mutation', isLoading, isUninitialized, isError, data, error)
  console.log(
    'tx receipt',
    isTxReceiptLoading,
    isTxReceiptFetching,
    isTxReceiptUninitialized,
    isTxReceiptError,
    isTxReceiptSuccess,
    txReceipt
  )

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} closeOnOverlayClick={false}>
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius="2xl" bg="bg.white">
          <AlertDialogHeader fontFamily="diatype" pt={6} fontSize="xl" fontWeight="medium">
            Cancel Withdrawal
          </AlertDialogHeader>
          {isUninitialized && (
            <AlertDialogBody>
              <Flex direction={'column'} alignItems={'center'}>
                <Flex gap={2} justifyContent="center" alignItems="center">
                  <TokenIcon fontSize="24px" tokenKey={offerTokenKey} />
                  <Text fontSize="xl" fontFamily="ppformula">{`${bigIntToNumberAsString(BigInt(offer_amount_spent), {
                    decimals: 18,
                    maximumFractionDigits: 2,
                  })} ${getSymbolByAddress(offer_token)}`}</Text>
                  <ArrowRight size={16} strokeWidth={1.5} />
                  {status === 'pending' && (
                    <Text fontSize="xl" fontFamily="ppformula" color="element.subdued">
                      Pending...
                    </Text>
                  )}
                </Flex>
                <Text fontSize="xl" color="element.subdued" fontFamily="diatype" textAlign="center">
                  Are you sure you want to cancel this transaction?
                </Text>
              </Flex>
              {/* Request */}
              <RequestDetails
                amount={amount}
                offerToken={offer_token}
                wantToken={want_token}
                deadline={deadline}
                createdTimestamp={created_timestamp}
                minimumPrice={atomicPriceAsNumber}
                receiveAtLeast={minimumPrice}
              />
            </AlertDialogBody>
          )}
          <AlertDialogFooter display="flex" flexDirection="column" gap={2}>
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
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default CancelWithdrawDialog
