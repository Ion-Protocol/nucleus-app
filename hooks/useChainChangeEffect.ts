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
    // Reason for disabling exhaustive-deps: we don't need to reun this useEffect based on the chainsConfig object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, dispatch])
}
