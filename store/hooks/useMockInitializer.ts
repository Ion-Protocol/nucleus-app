import { BridgeKey } from '@/types/Bridge'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setBridgesData } from '@/store/slices/bridges'

export function useMockInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      setBridgesData({
        [BridgeKey.ARBITRUM]: {
          tvl: BigInt(5022.123231 * 1e18).toString(),
          apy: BigInt(2.2132332 * 1e18).toString(),
        },
        [BridgeKey.EDGELESS]: {
          tvl: BigInt(3021.43569 * 1e18).toString(),
          apy: BigInt(1.809293 * 1e18).toString(),
        },
        [BridgeKey.SWELL]: {
          tvl: BigInt(179.949354 * 1e18).toString(),
          apy: BigInt(3.09343 * 1e18).toString(),
        },
      })
    )
  }, [dispatch])
}
