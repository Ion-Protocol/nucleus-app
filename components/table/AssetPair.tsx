import { truncateTxHash } from '@/utils/string'
import { Flex } from '@chakra-ui/react'

interface AssetPairProps {
  offerToken: string
  wantToken: string
}

// ? Added Want Token incase we want to show the direction of the trade
export function AssetPair({ offerToken, wantToken }: AssetPairProps) {
  return (
    <Flex alignItems="center" gap={2}>
      <span>{truncateTxHash(offerToken)}</span>
      {/* <span>→</span>
      <span>{wantToken}</span> */}
    </Flex>
  )
}
