import { TokenIcon } from '@/components/config/tokenIcons'
import { chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/tokens'
import { TransactionTableDataItem, TransactionFormattedTableDataItem } from '@/store/slices/portfolio/selectors'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Text, Flex } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'

export function ActivityCell(info: CellContext<TransactionTableDataItem, TransactionFormattedTableDataItem>) {
  const {
    type: action,
    sourceToken: sourceTokenKey,
    destinationToken: destinationTokenKey,
    sourceChain: sourceChainKey,
    destinationChain: destinationChainKey,
    sourceAmount,
    destinationAmount,
  } = info.row.original.table

  const sourceToken = tokensConfig[sourceTokenKey.toLowerCase() as TokenKey]
  const destinationToken = tokensConfig[destinationTokenKey.toLowerCase() as TokenKey]
  const sourceChain = chainsConfig[sourceChainKey.toLowerCase() as ChainKey]
  const destinationChain = chainsConfig[destinationChainKey.toLowerCase() as ChainKey]

  return (
    <Flex alignItems="center" gap="6px">
      <Text variant="body-16" color="element.subdued">
        {action}
      </Text>
      <Flex alignItems="center" gap="4px">
        <TokenIcon tokenKey={sourceToken?.key} />
        <Text variant="body-16" color="element.main">
          {sourceAmount} {sourceToken?.name}
        </Text>
        <Text variant="body-16" color="element.subdued">
          from {sourceChain?.name} to
        </Text>
        <TokenIcon tokenKey={destinationToken?.key} />
        <Text variant="body-16" color="element.main">
          {destinationAmount} {destinationToken?.name}
        </Text>
        <Text variant="body-16" color="element.subdued">
          on {destinationChain?.name}
        </Text>
      </Flex>
    </Flex>
  )
}
