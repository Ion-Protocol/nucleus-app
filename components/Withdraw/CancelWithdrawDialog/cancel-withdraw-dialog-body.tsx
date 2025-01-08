import { TokenIcon } from '@/components/config/tokenIcons'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumber, bigIntToNumberAsString } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { AlertDialogBody, Flex, Text } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { Address } from 'viem'
import RequestDetails from '../WithdrawalDetailModal/withdraw-request-details'

interface CancelWithdrawDialogBodyProps {
  offer_amount_spent: string
  offer_token: Address
  want_token: Address
  deadline: string
  created_timestamp: string
  created_transaction_hash: string
  atomic_price: string
  amount: string
  status: string
}
const CancelWithdrawDialogBody = ({
  offer_amount_spent,
  offer_token,
  want_token,
  deadline,
  created_timestamp,
  created_transaction_hash,
  atomic_price,
  amount,
  status,
}: CancelWithdrawDialogBodyProps) => {
  const headerThreshold = 0.01
  const displayAmount =
    bigIntToNumber(BigInt(amount), { decimals: 18 }) < headerThreshold
      ? '< 0.01'
      : bigIntToNumberAsString(BigInt(offer_amount_spent), {
          decimals: 18,
          maximumFractionDigits: 2,
        })
  const offerTokenKey = getSymbolByAddress(offer_token)?.toLowerCase() as TokenKey
  return (
    <AlertDialogBody overflow="hidden" display="flex" flexDirection="column" gap={4}>
      <Flex direction={'column'} alignItems={'center'}>
        <Flex gap={2} justifyContent="center" alignItems="center">
          <TokenIcon fontSize="24px" tokenKey={offerTokenKey} />
          <Text fontSize="xl" fontFamily="ppformula">{`${displayAmount} ${getSymbolByAddress(offer_token)}`}</Text>
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
        createdAtTxHash={created_transaction_hash}
        atomicPrice={atomic_price}
      />
    </AlertDialogBody>
  )
}

export default CancelWithdrawDialogBody
