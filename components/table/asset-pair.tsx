import { TokenKey } from '@/types/TokenKey'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { Flex } from '@chakra-ui/react'
import { Address } from 'viem'
import { TokenIcon } from '../config/tokenIcons'

interface AssetPairProps {
  offerToken: Address
  wantToken: Address
}

// ? Added Want Token incase we want to show the direction of the trade
export function AssetPair({ offerToken, wantToken }: AssetPairProps) {
  const offerTokenKey = getSymbolByAddress(offerToken)?.toLowerCase() as TokenKey
  const wantTokenKey = getSymbolByAddress(wantToken)?.toLowerCase() as TokenKey
  return (
    <Flex alignItems="center" gap={2}>
      <TokenIcon height={'32px'} width={'32px'} tokenKey={offerTokenKey} />
      <span>{getSymbolByAddress(offerToken)}</span>
      {/* <ArrowRight />
      <TokenIcon tokenKey={wantTokenKey} />
      <span>{getSymbolByAddress(wantToken)}</span> */}
    </Flex>
  )
}
