import { chakra, Flex, IconButton } from '@chakra-ui/react'
import { LayoutGridIcon as LucideLayoutGridIcon, ListFilterIcon as LucideListFilterIcon } from 'lucide-react'
import { RowsIcon } from '../shared/icons/Rows'
import { NetworkAssetListConnector } from './connector'
import NetworkAssetItem from './NetworkAssetItem'
import { useState } from 'react'
import { NetworkAssetTable } from './network-asset-table'

const LayoutGridIcon = chakra(LucideLayoutGridIcon)
const ListFilterIcon = chakra(LucideListFilterIcon)

function NetworkAssetList({ networkAssetKeys }: NetworkAssetListConnector.Props) {
  const [selectedLayout, setSelectedLayout] = useState<'grid' | 'table'>('grid')

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="flex-end" align="center">
        <IconButton
          onClick={() => setSelectedLayout('grid')}
          variant="ghost"
          icon={<LayoutGridIcon size="16px" color="element.subdued" />}
          size="sm"
          borderRadius="4px"
          aria-label="Grid"
          bg={selectedLayout === 'grid' ? 'bg.tertiary' : 'transparent'}
        />
        <IconButton
          onClick={() => setSelectedLayout('table')}
          variant="ghost"
          icon={<RowsIcon fontSize="16px" color="element.subdued" />}
          aria-label="Rows"
          size="sm"
          borderRadius="4px"
          bg={selectedLayout === 'table' ? 'bg.tertiary' : 'transparent'}
        />
        {/* <IconButton
          variant="ghost"
          icon={<ListFilterIcon size="16px" color="element.subdued" />}
          aria-label="List"
          size="sm"
          borderRadius="4px"
        /> */}
      </Flex>
      {selectedLayout === 'grid' ? (
        <Flex wrap="wrap" justifyContent="flex-start" alignItems="flex-start" gap={6}>
          {networkAssetKeys.map((tokenKey) => (
            <NetworkAssetItem key={tokenKey} networkAssetKey={tokenKey} />
          ))}
        </Flex>
      ) : (
        <NetworkAssetTable />
      )}
    </Flex>
  )
}

export default NetworkAssetListConnector.Connector(NetworkAssetList)
