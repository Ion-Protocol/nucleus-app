import { TokenIcon } from '@/components/config/tokenIcons'
import { StatusBadge } from '@/components/table/StatusBadge'
import { Order } from '@/types/Order'
import { TokenKey } from '@/types/TokenKey'
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
import { ArrowRight, TicketX } from 'lucide-react'
import { formatUnits } from 'viem'
import FulfilledDetails from './FulfilledDetails'
import RequestDetails from './RequestDetails'

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
          <RequestDetails
            amount={amount}
            offerToken={offer_token}
            wantToken={want_token}
            deadline={deadline}
            createdTimestamp={created_timestamp}
            minimumPrice={minimumPrice}
          />
          {/* Fulfillment */}
          {status === 'fulfilled' && (
            <FulfilledDetails
              filledPrice={filledPrice}
              wantToken={want_token}
              wantAmountRecAsNumber={wantAmountRecAsNumber}
              endingTimestamp={ending_timestamp}
            />
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
