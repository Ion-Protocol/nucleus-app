import { useRedeem } from '@/hooks/useRedeem'
import { ChakraProps, Flex } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { RootState } from '@/store'
import { selectTokenBalance } from '@/store/slices/balance'
import { selectRedemptionSourceChainKey } from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { useSelector } from 'react-redux'
import RedeemChainSelect from './RedeemChainSelect'
import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
interface RedeemProps extends ChakraProps {}

export function Redeem({ ...props }: RedeemProps) {
  const redemptionSourceChainKey = useSelector(selectRedemptionSourceChainKey)
  const networkAssetFromRoute = useSelector(selectNetworkAssetFromRoute)
  const tokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, redemptionSourceChainKey, networkAssetFromRoute)
  )
  const { handleRedeem, isValid, isLoading, redeemAmount } = useRedeem()

  return (
    <Flex direction="column" gap={6}>
      <RedeemChainSelect role="source" isActive={true} />
      {/* Redeem Token Destination */}
      <RedeemTokenInput />
      {/* Redeem Input */}
      <RedeemChainSelect role="destination" isActive={true} />
      <RedeemTokenDestination />
      {/* Redeem Summary */}
      <RedeemSummary />
      <ConnectAwareButton
        isDisabled={!isValid || redeemAmount > BigInt(tokenBalance || '0')}
        onClick={handleRedeem}
        isLoading={isLoading}
      >
        Redeem
      </ConnectAwareButton>
    </Flex>
  )
}
