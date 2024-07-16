import { ChainKey } from '@/config/bridges'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectChainConfig } from '@/store/slices/bridges'
import { setChainKey } from '@/store/slices/chain/slice'
import { useEffect } from 'react'
import { useChainId } from 'wagmi'

export function useChainChangeEffect() {
  const dispatch = useAppDispatch()
  const chainId = useChainId()
  const chainsConfig = useAppSelector(selectChainConfig)

  useEffect(() => {
    const currentChainKey = Object.keys(chainsConfig).find((key) => chainsConfig.id === chainId)
    if (currentChainKey) {
      dispatch(setChainKey(currentChainKey as ChainKey))
    }
    // Reason for disabling exhaustive-deps: we don't need to reun this useEffect based on the chainsConfig object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, dispatch])
}
