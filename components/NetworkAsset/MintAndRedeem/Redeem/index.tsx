import { useRedeem } from '@/hooks/useRedeem'
import { Flex, ChakraProps } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
import RedeemChainSelect from './RedeemChainSelect'
import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
interface RedeemProps extends ChakraProps {}

export function Redeem({ ...props }: RedeemProps) {
  const { handleRedeem, isValid, isLoading } = useRedeem()

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
      <ConnectAwareButton isDisabled={!isValid} onClick={handleRedeem} isLoading={isLoading}>
        Redeem
      </ConnectAwareButton>
    </Flex>
  )
}
