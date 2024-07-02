import { ChainKey, chainsConfig } from '@/config/chains'
import { useAppDispatch } from '@/store/hooks'
import { setChainKey } from '@/store/slices/chain/slice'
import { useEffect } from 'react'
import { useChainId } from 'wagmi'

export function useChainChangeEffect() {
  const dispatch = useAppDispatch()
  const chainId = useChainId()

  useEffect(() => {
    const currentChainKey = Object.keys(chainsConfig).find((key) => chainsConfig[key as ChainKey].id === chainId)
    if (currentChainKey) {
      dispatch(setChainKey(currentChainKey as ChainKey))
    }
  }, [chainId, dispatch])
}
