import { TokenIcon } from '@/components/config/tokenIcons'
import { StatusBadge } from '@/components/table/StatusBadge'
import { Order } from '@/types/Order'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import {
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { ArrowRight, TicketX } from 'lucide-react'
import { formatUnits } from 'viem'

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
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Withdraw Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap={2}>
          <Flex gap={2} justifyContent="center" alignItems="center">
            <TokenIcon fontSize="24px" tokenKey={offerTokenKey} />
            <Text>{getSymbolByAddress(offer_token)}</Text>
            <ArrowRight />
            {status === 'fulfilled' && (
              <>
                <TokenIcon fontSize="24px" tokenKey={wantTokenKey} />
                <Text>{getSymbolByAddress(want_token)}</Text>
              </>
            )}
            {status === 'pending' && <Text>Pending...</Text>}
            {status === 'cancelled' && <TicketX />}
          </Flex>
          {/* Request */}
          <Heading as="h4" size="md">
            Request
          </Heading>
          <Flex direction="column" gap={2} border="1px solid" borderColor="gray.200" p={4} borderRadius="md">
            <Flex justifyContent="space-between">
              <Text>To Redeem</Text>
              <Text>
                {bigIntToNumberAsString(BigInt(amount), { minimumFractionDigits: 0, maximumFractionDigits: 8 })}{' '}
                {getSymbolByAddress(offer_token)}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Minimum Price</Text>
              <Text>{`${minimumPrice} ${getSymbolByAddress(want_token)}/${getSymbolByAddress(offer_token)}`}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Receive at least</Text>
              <Text>
                {`
                ${bigIntToNumberAsString(BigInt(amount), { minimumFractionDigits: 0, maximumFractionDigits: 8 })} 
                ${getSymbolByAddress(want_token)}
                `}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Deadline</Text>
              <Text>{format(fromUnixTime(Number(deadline)), 'PPpp')}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>Created at</Text>
              <Text>{format(fromUnixTime(Number(created_timestamp)), 'PPpp')}</Text>
            </Flex>
          </Flex>
          {/* Fulfillment */}
          {status === 'fulfilled' && (
            <>
              <Heading as="h4" size="md">
                Fulfillment
              </Heading>
              <Flex direction="column" gap={2} border="1px solid" borderColor="gray.200" p={4} borderRadius="md">
                <Flex justifyContent="space-between">
                  <Text>Filled Price</Text>
                  <Text>{filledPrice}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text>Received</Text>
                  <Text>{`${wantAmountRecAsNumber} ${getSymbolByAddress(want_token)}`}</Text>
                </Flex>

                <Flex justifyContent="space-between">
                  <Text>Filled at</Text>
                  <Text>{format(fromUnixTime(Number(ending_timestamp)), 'PPpp')}</Text>
                </Flex>
              </Flex>
            </>
          )}
        </ModalBody>
        <ModalFooter fontSize="sm" display="flex" justifyContent="space-between">
          <Text fontSize={'inherit'}>Status</Text>
          <StatusBadge status={status} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WithdrawDetailsModal
