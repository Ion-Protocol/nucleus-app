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
    // Ensure this code runs only in the browser
    if (typeof window !== 'undefined') {
      const storedChainId = localStorage.getItem('connectedChainId')
      if (storedChainId && !isNaN(parseInt(storedChainId))) {
        const parsedChainId = parseInt(storedChainId)
        setPreviousChainId(parsedChainId)
        dispatch(setChainId(parsedChainId))
      } else {
        // Optionally set a default chain ID if not found or invalid
        const defaultChainId = 1 // mainnet as default
        setPreviousChainId(defaultChainId)
        dispatch(setChainId(defaultChainId))
        localStorage.setItem('connectedChainId', defaultChainId.toString())
      }
    }
  }, [dispatch])

  useEffect(() => {
    // Ensure chainId is valid before proceeding
    if (chainId !== null && previousChainId !== null && chainId !== previousChainId) {
      // Handle side effect the redux way when chainId changes in state
      router.push('/dashboard')

      localStorage.setItem('connectedChainId', chainId.toString())
      setPreviousChainId(chainId)
      dispatch(setChainId(chainId))
    }
  }, [chainId, previousChainId, dispatch, router])
}
