import { TokenIcon } from '@/components/config/tokenIcons'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { AlertDialogBody, Flex, Text } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { Address } from 'viem'
import RequestDetails from '../WithdrawalDetailModal/withdraw-request-details'

interface CancelWithdrawDialogBodyProps {
  offerTokenKey: TokenKey
  offer_amount_spent: string
  offer_token: Address
  want_token: Address
  deadline: string
  created_timestamp: string
  atomicPriceAsNumber: number
  minimumPrice: number
  amount: string
  status: string
}
const CancelWithdrawDialogBody = ({
  offerTokenKey,
  offer_amount_spent,
  offer_token,
  want_token,
  deadline,
  created_timestamp,
  atomicPriceAsNumber,
  minimumPrice,
  amount,
  status,
}: CancelWithdrawDialogBodyProps) => {
  return (
    <AlertDialogBody overflow="hidden" display="flex" flexDirection="column" gap={4}>
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
  )
}

export default CancelWithdrawDialogBody
