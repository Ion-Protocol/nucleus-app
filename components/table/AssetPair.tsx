import { Flex } from '@chakra-ui/react'

interface AssetPairProps {
  offerToken: string
  wantToken: string
}

export function AssetPair({ offerToken, wantToken }: AssetPairProps) {
  return (
    <Flex alignItems="center" gap={2}>
      <span>{offerToken}</span>
      <span>→</span>
      <span>{wantToken}</span>
    </Flex>
  )
}
