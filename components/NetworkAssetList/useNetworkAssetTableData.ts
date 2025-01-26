import { NetworkKey, networksConfig } from '@/config/networks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectBridgesState } from '@/store/slices/networkAssets'
import { nucleusBackendApi } from '@/store/slices/nucleusBackendApi'
import { selectUsdPerEthRate } from '@/store/slices/price'
import { DashboardTableDataItem } from '@/types'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumber } from '@/utils/bigint'
import { abbreviateNumber, numberToPercent } from '@/utils/number'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useNetworkAssetTableData() {
  const dispatch = useAppDispatch()

  const [data, setData] = useState<DashboardTableDataItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const usdPerEthRate = useAppSelector(selectUsdPerEthRate)
  const bridgesState = useAppSelector(selectBridgesState)

  const networkAssetConfig = useMemo(() => networksConfig[NetworkKey.MAINNET].assets, [])
  const networkAssetKeys = useMemo(() => Object.keys(networkAssetConfig) as TokenKey[], [networkAssetConfig])

  const fetchRewardsAPY = useCallback(async () => {
    try {
      setIsLoading(true)
      const promises = networkAssetKeys.map(async (networkAssetKey) => {
        const vaultAddress = networkAssetConfig[networkAssetKey]?.contracts.boringVault
        if (!vaultAddress) {
          return {
            asset: networkAssetKey,
            apy: '0%',
            chain: networkAssetConfig[networkAssetKey]?.chain,
            tvl: { formatted: '0', value: 0 },
            applications: networkAssetConfig[networkAssetKey]?.protocols || [],
          }
        }

        // Make the API call to get the APY
        const result = await dispatch(
          nucleusBackendApi.endpoints.getDefaultYieldAPY.initiate({ tokenAddress: vaultAddress })
        )

        const apy = result?.data?.apy ?? 0
        const formattedApy = numberToPercent(apy, 2)

        const tvlAsBigIntString = bridgesState.tvl.data[networkAssetKey]
        const tvlAsBigInt = BigInt(tvlAsBigIntString)
        const tvlInUsdAsBigInt = (tvlAsBigInt * usdPerEthRate) / BigInt(1e8)
        const tvlInUsdAsNumber = bigIntToNumber(tvlInUsdAsBigInt)
        const formattedTvl = abbreviateNumber(tvlInUsdAsNumber)

        return {
          asset: networkAssetKey,
          apy: formattedApy,
          chain: networkAssetConfig[networkAssetKey]?.chain,
          tvl: {
            formatted: formattedTvl,
            value: tvlInUsdAsNumber,
          },
          applications: networkAssetConfig[networkAssetKey]?.protocols || [],
        }
      })

      const resolvedData = await Promise.all(promises)
      setData(resolvedData)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [networkAssetKeys, networkAssetConfig, bridgesState, usdPerEthRate, dispatch])

  useEffect(() => {
    fetchRewardsAPY()
  }, [fetchRewardsAPY])

  return { data, isLoading }
}
