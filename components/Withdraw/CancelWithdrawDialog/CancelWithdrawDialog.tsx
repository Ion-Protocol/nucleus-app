import { TokenIcon } from '@/components/config/tokenIcons'
import { Order } from '@/types/Order'
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
  Text,
} from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { formatUnits } from 'viem'

interface CancelWithdrawDialogProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

function CancelWithdrawDialog({ isOpen, onClose, order }: CancelWithdrawDialogProps) {
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
    console.log('cancel order')
    console.table(order)
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cancel Withdrawal
          </AlertDialogHeader>

          <AlertDialogBody>
            <Flex gap={2} justifyContent="center" alignItems="center">
              <TokenIcon fontSize="24px" tokenKey={offerTokenKey} />
              <Text>{getSymbolByAddress(offer_token)}</Text>
              <ArrowRight />
              {status === 'pending' && <Text>Pending...</Text>}
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
          </AlertDialogBody>

          <AlertDialogFooter display="flex" flexDirection="column" gap={2}>
            <Button onClick={handleCancelOrder} width="100%" colorScheme="red">
              Cancel
            </Button>
            <Button ref={cancelRef} onClick={onClose} width="100%">
              Go Back
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default CancelWithdrawDialog
