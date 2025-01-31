import { NetworkKey, networksConfig } from '@/config/networks'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Button, chakra, Flex, IconButton } from '@chakra-ui/react'
import { LayoutGridIcon as LucideLayoutGridIcon, ListFilterIcon as LucideListFilterIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { RowsIcon } from '../shared/icons/Rows'
import { MultiSelectFilter } from '../table/multi-select-filter'
import { NetworkAssetListConnector } from './connector'
import { NetworkAssetTable } from './network-asset-table'
import NetworkAssetItem from './NetworkAssetItem'

const LayoutGridIcon = chakra(LucideLayoutGridIcon)
const ListFilterIcon = chakra(LucideListFilterIcon)

export const tokenAddressMapping: Partial<Record<TokenKey, Address>> = {
  [TokenKey.SSETH]: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
  [TokenKey.FETH]: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
  [TokenKey.RARIETH]: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
  [TokenKey.UNIFIETH]: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
  [TokenKey.EARNETH]: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
  [TokenKey.TETH]: '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
  [TokenKey.BOBAETH]: '0x52E4d8989fa8b3E1C06696e7b16DEf5d7707A0d1',
}

const chainKeys = [
  ChainKey.SEI,
  ChainKey.FORM,
  ChainKey.RARI,
  ChainKey.UNIFI,
  ChainKey.SWELL,
  ChainKey.ECLIPSE,
  ChainKey.BOBA,
]

function NetworkAssetList({ networkAssetKeys, tvls }: NetworkAssetListConnector.Props) {
  const [selectedLayout, setSelectedLayout] = useState<'grid' | 'table'>('table')
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])

  const filteredNetworkAssets = useMemo(() => {
    return networkAssetKeys.filter((networkAssetKey) => {
      const matchAsset =
        selectedAssets.length === 0 ||
        selectedAssets.includes(tokenAddressMapping[networkAssetKey as TokenKey] as string)

      const networkAssetChain = networksConfig[NetworkKey.MAINNET].assets[networkAssetKey]?.chain
      const matchNetwork = selectedNetworks.length === 0 || selectedNetworks.includes(networkAssetChain as string)
      return matchAsset && matchNetwork
    })
  }, [networkAssetKeys, selectedAssets, selectedNetworks])

  const sortedNetworkAssetKeys = useMemo(() => {
    return (
      networkAssetKeys
        // ! Remove RARI from the list. This is temporary while we depreciate RARI and remove it all together.
        .filter((key) => networksConfig[NetworkKey.MAINNET].assets[key]?.chain !== ChainKey.RARI)
        .sort((a, b) => {
          return Number(tvls[b]) - Number(tvls[a])
        })
    )
  }, [networkAssetKeys, tvls])

  function handleClearFilters() {
    setSelectedAssets([])
    setSelectedNetworks([])
  }

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="flex-end" align="center">
        <Flex justifyContent={'flex-end'} alignItems="center">
          {(selectedAssets.length > 0 || selectedNetworks.length > 0) && (
            <Button
              color="element.subdued"
              variant="link"
              onClick={handleClearFilters}
              fontFamily="diatype"
              fontWeight="normal"
              size="sm"
              fontSize="14px"
              textTransform="uppercase"
              mr={3}
              mb="-4px"
            >
              Clear Filters
            </Button>
          )}
          <MultiSelectFilter
            title="by Asset Type"
            selectedValues={selectedAssets}
            onChange={(addresses: string[]) => setSelectedAssets(addresses as string[])}
            options={tokenAddressMapping}
            isAssetFilter={true}
          />
          <MultiSelectFilter
            title="by Network"
            selectedValues={selectedNetworks}
            onChange={(values: string[]) => setSelectedNetworks(values)}
            options={Object.fromEntries(chainKeys.map((key) => [key, key]))}
            isNetworkFilter={true}
          />
        </Flex>
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
      </Flex>
      {selectedLayout === 'grid' ? (
        <Flex wrap="wrap" justifyContent="flex-start" alignItems="flex-start" gap={6}>
          {sortedNetworkAssetKeys.map((tokenKey) => (
            <NetworkAssetItem key={tokenKey} networkAssetKey={tokenKey} />
          ))}
        </Flex>
      ) : (
        <NetworkAssetTable selectedAssets={selectedAssets} selectedNetworks={selectedNetworks} />
      )}
    </Flex>
  )
}

export default NetworkAssetListConnector.Connector(NetworkAssetList)
