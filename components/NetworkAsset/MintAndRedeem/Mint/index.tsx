import { useAppSelector } from '@/store/hooks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ChakraProps, Divider, Flex } from '@chakra-ui/react'
import ChainSelect from '../shared/ChainSelect'
import Deposit from '../shared/Deposit'
import Summary from '../shared/Summary'
import TokenInput from '../shared/TokenInput'
import SolanaAddressInput from '../shared/SolanaAddressInput'
import TokenDestination from '../shared/TokenDestination'

interface MintProps extends ChakraProps {}

export function Mint({ ...props }: MintProps) {
  const networkAssetKeyFromRoute = useAppSelector(selectNetworkAssetFromRoute)

  return (
    <Flex direction="column" {...props} gap={6}>
      <ChainSelect role="source" txType="mint" isActive={true} />
      <TokenInput />
      <ChainSelect role="destination" txType="mint" isActive={false} />
      {networkAssetKeyFromRoute === TokenKey.TETH && <SolanaAddressInput />}
      <TokenDestination />
      <Summary />
      <Divider />
      <Deposit />
    </Flex>
  )
}
