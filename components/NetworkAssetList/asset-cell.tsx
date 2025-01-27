import { chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/tokens'
import { DashboardTableDataItem } from '@/types'
import { TokenKey } from '@/types/TokenKey'
import { Flex, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ChainIcon } from '../config/chainIcons'
import { TokenIcon } from '../config/tokenIcons'
import { IconWithSubIcon } from '../shared/icon-with-sub-icon'

export function AssetCell({ info }: { info: CellContext<DashboardTableDataItem, TokenKey> }) {
  const { asset: tokenKey, chain: chainKey } = info.row.original
  const token = tokensConfig[tokenKey]
  const chain = chainKey ? chainsConfig[chainKey] : null

  return (
    <Flex gap={3} align="center">
      <IconWithSubIcon
        icon={<TokenIcon fontSize="24px" tokenKey={tokenKey} />}
        subIcon={<ChainIcon chainKey={chainKey} />}
      />
      <Flex direction="column">
        <Text variant="body-16">{token.name}</Text>
        <Text variant="body-14" color="element.subdued">
          {chain?.name}
        </Text>
      </Flex>
    </Flex>
  )
}
