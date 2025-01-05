import { TokenIcon } from '@/components/config/tokenIcons'
import { StatusBadge } from '@/components/table/StatusBadge'
import { Order } from '@/types/Order'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
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
import { ArrowRight, Ban, Box } from 'lucide-react'
import { formatUnits } from 'viem'
import FulfilledDetails from './withdraw-fulfilled-details'
import RequestDetails from './withdraw-request-details'

const WithdrawDetailsModal = ({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}) => {
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
              <TokenIcon fontSize="24px" tokenKey={offerTokenKey} />
              <Text fontSize="xl" fontFamily="ppformula">{`${bigIntToNumberAsString(BigInt(offer_amount_spent), {
                decimals: 18,
                maximumFractionDigits: 2,
              })} ${getSymbolByAddress(offer_token)}`}</Text>
            </Flex>
            <ArrowRight size={16} strokeWidth={1.5} />
            {status === 'fulfilled' && (
              <Flex gap={2}>
                <TokenIcon fontSize="24px" tokenKey={wantTokenKey} />
                <Text fontSize="xl" color="element.main" fontFamily="ppformula">{` ${bigIntToNumberAsString(
                  BigInt(want_amount_rec),
                  {
                    decimals: 18,
                    maximumFractionDigits: 2,
                  }
                )} ${getSymbolByAddress(want_token)}`}</Text>
              </Flex>
            )}
            {status === 'pending' && (
              <Text fontSize="xl" fontFamily="ppformula" color="element.subdued">
                Pending...
              </Text>
            )}
            {status === 'cancelled' && (
              <Box color="element.subdued">
                <Ban size={24} strokeWidth={1.5} />
              </Box>
            )}
          </Flex>
          <Flex direction="column" gap={6}>
            {/* Request */}
            <RequestDetails
              amount={amount}
              offerToken={offer_token}
              wantToken={want_token}
              deadline={deadline}
              receiveAtLeast={minimumPrice}
              createdTimestamp={created_timestamp}
              minimumPrice={atomicPriceAsNumber}
            />
            {/* Fulfillment */}
            {status === 'fulfilled' && (
              <FulfilledDetails
                filledPrice={filledPrice}
                offerToken={offer_token}
                wantToken={want_token}
                wantAmountRecAsNumber={wantAmountRecAsNumber}
                endingTimestamp={ending_timestamp}
              />
            )}
          </Flex>
        </ModalBody>
        <ModalFooter fontSize="md" display="flex" justifyContent="space-between" paddingBottom={8}>
          <Text fontSize={'inherit'} color="neutral.800">
            Status
          </Text>
          <StatusBadge status={status} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WithdrawDetailsModal
