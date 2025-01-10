import { TokenIcon } from '@/components/config/tokenIcons'
import { StatusBadge } from '@/components/table/status-badge'
import FulfilledDetails from '@/components/Withdraw/WithdrawalDetailModal/withdraw-fulfilled-details'
import RequestDetails from '@/components/Withdraw/WithdrawalDetailModal/withdraw-request-details'
import { tokensConfig } from '@/config/tokens'
import { TransactionTableDataItem } from '@/store/slices/portfolio/selectors'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumber, bigIntToNumberAsString } from '@/utils/bigint'
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { Address, parseEther } from 'viem'

export const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
}: {
  isOpen: boolean
  onClose: () => void
  transaction: TransactionTableDataItem | null
}) => {
  if (!transaction) return null
  const {
    activity,
    sourceAmount,
    destinationAmount,
    minimumPrice,
    receiveAtLeast,
    deadline,
    createdAt,
    filledPrice,
    filledAt,
    table,
    status,
  } = transaction

  const sourceTokenObject = tokensConfig[activity.source.token as TokenKey]
  const destTokenObject = tokensConfig[activity.destination.token as TokenKey]

  const headerThreshold = 0.01
  const displayAmount =
    bigIntToNumber(BigInt(sourceAmount), { decimals: 18 }) < headerThreshold
      ? '< 0.01'
      : bigIntToNumberAsString(BigInt(sourceAmount), {
          decimals: 18,
          maximumFractionDigits: 2,
        })

  const displayWantAmountRec =
    bigIntToNumber(BigInt(destinationAmount), { decimals: 18 }) < headerThreshold
      ? '< 0.01'
      : bigIntToNumberAsString(BigInt(destinationAmount), {
          decimals: 18,
          maximumFractionDigits: 2,
        })

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="2xl" fontFamily="diatype" bg="bg.white">
        <ModalHeader pt={6} fontSize="xl" fontWeight="medium" color="element.main">
          Withdraw Transaction
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap={6} color="element.main">
          <Flex gap={4} justifyContent="center" alignItems="center">
            <Flex gap={2}>
              <TokenIcon fontSize="24px" tokenKey={activity.source.token as TokenKey} />
              <Text fontSize="xl" fontFamily="ppformula">{`${displayAmount} ${table.sourceToken}`}</Text>
            </Flex>
            <ArrowRight size={16} strokeWidth={1.5} />
            {status === 'fulfilled' && (
              <Flex gap={2}>
                <TokenIcon fontSize="24px" tokenKey={activity.destination.token as TokenKey} />
                <Text
                  fontSize="xl"
                  color="element.main"
                  fontFamily="ppformula"
                >{`${displayWantAmountRec} ${table.destinationToken}`}</Text>
              </Flex>
            )}
            {status === 'pending' && (
              <Text fontSize="xl" fontFamily="ppformula" color="element.subdued">
                Pending...
              </Text>
            )}
            {status === 'cancelled' && (
              <Text fontSize="xl" fontFamily="ppformula" color="element.subdued">
                Cancelled
              </Text>
            )}
          </Flex>
          <Flex direction="column" gap={6}>
            {/* Request */}
            <RequestDetails
              amount={sourceAmount}
              atomicPrice={parseEther(minimumPrice.toString()).toString()}
              offerToken={sourceTokenObject.addresses[ChainKey.ETHEREUM] as Address}
              wantToken={destTokenObject.addresses[ChainKey.ETHEREUM] as Address}
              deadline={deadline.toString()}
              createdTimestamp={createdAt.toString()}
              createdAtTxHash={'0x0'}
            />
            {/* Fulfillment */}
            {status === 'fulfilled' && (
              <FulfilledDetails
                offerToken={sourceTokenObject.addresses[ChainKey.ETHEREUM] as Address}
                offerAmountSpent={sourceAmount}
                wantToken={destTokenObject.addresses[ChainKey.ETHEREUM] as Address}
                wantAmountRec={destinationAmount}
                endingTimestamp={filledAt.toString()}
                filledAtTxHash={'0x0'}
              />
            )}
          </Flex>
        </ModalBody>
        <ModalFooter fontSize="md" display="flex" justifyContent="space-between" paddingBottom={8}>
          <Text fontSize={'inherit'} color="neutral.800">
            Status
          </Text>
          <StatusBadge status={status as 'pending' | 'fulfilled' | 'cancelled'} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
