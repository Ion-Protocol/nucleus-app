import { ChainKey, chainsConfig } from '@/config/chains'
import { useAppDispatch } from '@/store/hooks'
import { setChainKey } from '@/store/slices/chain'
import { useEffect, useMemo } from 'react'
import { useChainId } from 'wagmi'

export function useChainChangeEffect() {
  const dispatch = useAppDispatch()
  const chainId = useChainId()

  // We access the chain using the chainKey, so we need to find the chainKey from the chainId
  const currentChainKey = useMemo(
    () => Object.keys(chainsConfig).find((key) => chainsConfig[key as ChainKey].id === chainId),
    [chainId]
  ) as ChainKey | undefined

  useEffect(() => {
    if (!currentChainKey) return
    dispatch(setChainKey(currentChainKey))
  }, [currentChainKey, dispatch])
}
