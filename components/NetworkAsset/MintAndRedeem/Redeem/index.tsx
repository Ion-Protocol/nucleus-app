import { useRedeem } from '@/hooks/useRedeem'
import { Button, Flex, ChakraProps, Menu, MenuButton, Text } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
import RedeemChainSelect from './RedeemChainSelect'
import { selectAddress } from '@/store/slices/account'
import { useSelector } from 'react-redux'
import { selectRedemptionSourceChainKey } from '@/store/slices/networkAssets'
import { ChainIcon } from '@/components/config/chainIcons'
import { chainsConfig } from '@/config/chains'
interface RedeemProps extends ChakraProps {}

export function Redeem({ ...props }: RedeemProps) {
  const { handleRedeem, isValid } = useRedeem()
  const redemptionChainKey = useSelector(selectRedemptionSourceChainKey)
  const redemptionChainName = chainsConfig[redemptionChainKey!].name
  const address = useSelector(selectAddress)

  return (
    <Flex direction="column" gap={6}>
      <Button
        variant="outline"
        borderWidth="1px"
        borderColor="border"
        justifyContent="flex-start"
        textAlign="left"
        color={'disabled'}
        bg={'formBackground'}
        pointerEvents={'none'}
      >
        <Flex align="center" gap={3}>
          {redemptionChainKey && <ChainIcon chainKey={redemptionChainKey} />}
          <Text variant="paragraph">Redeem from {redemptionChainName}</Text>
        </Flex>
      </Button>
      {/* Redeem Token Destination */}
      <RedeemTokenInput />
      {/* Redeem Input */}
      <RedeemChainSelect role="destination" isActive={true} />
      <RedeemTokenDestination />
      {/* Redeem Summary */}
      <RedeemSummary />
      <Button isDisabled={!isValid} onClick={handleRedeem}>
        Redeem
      </Button>
    </Flex>
  )
}
