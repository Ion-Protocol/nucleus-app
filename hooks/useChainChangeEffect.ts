import { useAppDispatch } from '@/store/hooks'
import { setChainId } from '@/store/slices/chain'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'

export function useChainChangeEffect() {
  const chainId = useChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [previousChainId, setPreviousChainId] = useState<number | null>(null)

  useEffect(() => {
    // Load initial chain ID from local storage on component mount
    // This ensures that the application starts with the correct chain ID even after a page refresh.
    // Without this, the initial chain ID would incorrectly be 1 (mainnet) even if connected to a different chain.
    // This is due to the nature of SSR in Next.js and the fact that `wagmi` does not provide the correct chain ID on the first render.
    const storedChainId = localStorage.getItem('connectedChainId')
    if (storedChainId) {
      setPreviousChainId(parseInt(storedChainId))
      dispatch(setChainId(parseInt(storedChainId)))
    }
  }, [dispatch])

  useEffect(() => {
    // If the previous chain ID is not null and the current chain ID is different from the previous one,
    // this indicates that the user has changed the chain and confirmed it in their wallet.
    // Update local storage with the new chain ID and update the application state.
    // This prevents false detections of chain changes caused by the initial incorrect value provided by `wagmi`.
    if (previousChainId !== null && chainId !== previousChainId) {
      // TODO: Handle side effect the redux way when chainId changes in state
      router.push('/dashboard')

      localStorage.setItem('connectedChainId', chainId.toString())
      setPreviousChainId(chainId)
      dispatch(setChainId(chainId))
    }
  }, [chainId, previousChainId, dispatch, router])
}
