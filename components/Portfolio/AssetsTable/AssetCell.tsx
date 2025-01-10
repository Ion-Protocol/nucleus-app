import { TokenIcon } from '@/components/config/tokenIcons'
import { chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/tokens'
import { AssetDataItem } from '@/store/slices/portfolio/selectors'
import { TokenKey } from '@/types/TokenKey'
import { Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'

export function AssetCell({ info, isLoading }: { info: CellContext<AssetDataItem, TokenKey>; isLoading?: boolean }) {
  const { asset: tokenKey, network: chainKey } = info.row.original
  const token = tokensConfig[tokenKey]
  const chain = chainsConfig[chainKey]

  return (
    <Flex gap={3} align="center">
      {!isLoading ? (
        <>
          <TokenIcon tokenKey={tokenKey} fontSize="24px" />
          <Flex direction="column">
            <Text variant="body-16-m" color="element.main">
              {token.name}
            </Text>
            <Text variant="body-14" color="element.subdued">
              {chain.name}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex align="center" gap={3}>
          <SkeletonCircle size="24px" startColor="element.invert.secondary" endColor="element.invert.primary" />
          <Skeleton
            width="140px"
            height="14px"
            startColor="element.invert.secondary"
            endColor="element.invert.primary"
            borderRadius="8px"
          />
        </Flex>
      )}
    </Flex>
  )
}
