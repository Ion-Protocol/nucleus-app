import { TokenIcon } from '@/components/config/tokenIcons'
import { TxAnimationWrapper } from '@/components/global/tx-animation-wrapper'
import ErrorCodeBlock from '@/components/global/tx-dialog/error-code-block'
import TxSteps from '@/components/global/tx-steps'
import { useChainManagement } from '@/hooks/useChainManagement'
import { RootState } from '@/store'
import {
  selectBridgeAmount,
  selectBridgeAmountAsBigInt,
  selectBridgeDataForBridge,
  selectBridgeDestinationChainId,
  selectBridgeSourceChainId,
  selectContractAddressByName,
} from '@/store/slices/networkAssets'
import { useBridgeMutation } from '@/store/slices/tellerApi'
import { useWaitForTransactionReceiptQuery } from '@/store/slices/transactionReceiptApt'
import { TokenKey } from '@/types/TokenKey'
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
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

interface BridgeDialogProps {
  isOpen: boolean
  onClose: () => void
  previewFee: string
}

function BridgeDialog({ isOpen, onClose, previewFee }: BridgeDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [isFullErrorDisplayed, setIsFullErrorDisplayed] = useState(false)
  const { switchToChain } = useChainManagement()

  // Use the same selectors as the parent component
  const bridgeAmountAsBigInt = useSelector(selectBridgeAmountAsBigInt)
  const bridgeAmount = useSelector(selectBridgeAmount)
  const bridgeData = useSelector(selectBridgeDataForBridge)
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const boringVaultContractAddress = useSelector((state: RootState) =>
    selectContractAddressByName(state, 'boringVault')
  )
  const bridgeDestinationChainId = useSelector(selectBridgeDestinationChainId)
  const bridgeSourceChainId = useSelector(selectBridgeSourceChainId)
  const [
    bridge,
    {
      error: bridgeMutationError,
      data: bridgeMutationData,
      isLoading: isBridgeMutationLoading,
      isUninitialized,
      isError: isBridgeMutationError,
      isSuccess: isBridgeMutationSuccess,
      status: bridgeMutationStatus,
    },
  ] = useBridgeMutation()

  const {
    data: txReceipt,
    error: txReceiptError,
    status: txReceiptStatus,
    isLoading: isTxReceiptLoading,
    isError: isTxReceiptError,
    isSuccess: isTxReceiptSuccess,
  } = useWaitForTransactionReceiptQuery({ hash: bridgeMutationData! }, { skip: !bridgeMutationData })

  // Trigger bridge immediately if we have all required data
  if (
    isOpen &&
    isUninitialized &&
    bridgeData &&
    bridgeAmountAsBigInt &&
    tellerContractAddress &&
    bridgeDestinationChainId &&
    bridgeSourceChainId
  ) {
    switchToChain(bridgeSourceChainId)
    bridge({
      shareAmount: bridgeAmountAsBigInt,
      bridgeData,
      contractAddress: tellerContractAddress,
      chainId: bridgeDestinationChainId,
      fee: BigInt(previewFee),
    })
  }

  const handleToggleDisplayFullError = () => {
    setIsFullErrorDisplayed(!isFullErrorDisplayed)
  }

  const sourceTokenKey = getSymbolByAddress(boringVaultContractAddress as `0x${string}`)?.toLowerCase() as TokenKey
  const destinationTokenKey = getSymbolByAddress(boringVaultContractAddress as `0x${string}`)?.toLowerCase() as TokenKey

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
            Bridge Assets
          </AlertDialogHeader>

          <AlertDialogBody display="flex" flexDirection="column" gap={6}>
            {!isFullErrorDisplayed && bridgeAmountAsBigInt && (
              <TxAnimationWrapper
                amount={bigIntToNumberAsString(bridgeAmountAsBigInt, {
                  decimals: 18,
                })}
                offerToken={boringVaultContractAddress as `0x${string}`}
                offerTokenKey={sourceTokenKey}
                isError={isBridgeMutationError || isTxReceiptError}
                isLoading={isBridgeMutationLoading || isTxReceiptLoading}
                isSuccess={isBridgeMutationSuccess && isTxReceiptSuccess}
                loop
                autoplay
              />
            )}

            {!isBridgeMutationError && !isTxReceiptError && !isTxReceiptSuccess && (
              <TxSteps
                steps={[
                  { title: 'Awaiting wallet signature', status: bridgeMutationStatus },
                  { title: 'Pending Confirmation', status: txReceiptStatus },
                ]}
              />
            )}

            {isTxReceiptSuccess && bridgeAmountAsBigInt && (
              <Flex flexDirection="column" alignItems="center" gap={4}>
                <Flex gap={2} justifyContent="center" alignItems="center">
                  <TokenIcon fontSize="24px" tokenKey={sourceTokenKey} />
                  <Text as="h1" fontFamily="ppformula" fontSize="xl" fontWeight="medium">
                    {`${bigIntToNumberAsString(bridgeAmountAsBigInt, {
                      decimals: 18,
                      maximumFractionDigits: 2,
                    })} ${getSymbolByAddress(boringVaultContractAddress as `0x${string}`)}`}
                  </Text>
                  <Icon as={ArrowRight} size={16} color="element.subdued" strokeWidth={1.5} />
                  <TokenIcon fontSize="24px" tokenKey={destinationTokenKey} />
                </Flex>
                <Text fontFamily="diatype" fontSize="xl" fontWeight="normal" textAlign="center" color="element.main">
                  Bridge initiated successfully
                </Text>
              </Flex>
            )}

            {(isBridgeMutationError || isTxReceiptError) && (
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
                    error={isBridgeMutationError ? (bridgeMutationError as string) : (txReceiptError as string)}
                  />
                )}
                <Button
                  fontFamily="diatype"
                  fontWeight="normal"
                  variant="link"
                  color="crystal.600"
                  onClick={handleToggleDisplayFullError}
                  rightIcon={
                    isFullErrorDisplayed ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />
                  }
                >
                  {isFullErrorDisplayed ? 'Hide Details' : 'Expand for details'}
                </Button>
              </Flex>
            )}
          </AlertDialogBody>

          <AlertDialogFooter display="flex" flexDirection="column" gap={2}>
            {(isBridgeMutationError || isTxReceiptError || isTxReceiptSuccess) && (
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

export default BridgeDialog
