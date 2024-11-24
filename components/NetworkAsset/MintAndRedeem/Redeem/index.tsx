import { useRedeem } from '@/hooks/redeem/useRedeem'
import { ChakraProps, Flex } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { useChainManagement } from '@/hooks/useChainManagement'
import { RootState } from '@/store'
import { selectTokenBalance } from '@/store/slices/balance'
import { selectDestinationChainId, selectRedemptionSourceChainKey } from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { useSelector } from 'react-redux'
import RedeemChainSelect from './RedeemChainSelect'
import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
interface RedeemProps extends ChakraProps {}

export function Redeem({ ...props }: RedeemProps) {
  const { switchToChain } = useChainManagement()
  const redemptionSourceChainKey = useSelector(selectRedemptionSourceChainKey)
  const networkAssetFromRoute = useSelector(selectNetworkAssetFromRoute)
  const destinationChainId = useSelector(selectDestinationChainId)
  const tokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, redemptionSourceChainKey, networkAssetFromRoute)
  )
  const { handleRedeem, isValid, isLoading, redeemAmount } = useRedeem()

  const handleRedeemClick = async () => {
    // if (!destinationChainId) {
    //   console.error('No destination chain id')
    //   return
    // }
    // console.log('destinationChainId', destinationChainId)
    // await switchToChain(destinationChainId)
    handleRedeem()
  }

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
        // isDisabled={!isValid || redeemAmount > BigInt(tokenBalance || '0')}
        onClick={handleRedeem}
        isLoading={isLoading}
      >
        Redeem
      </ConnectAwareButton>
    </Flex>
  )
}
