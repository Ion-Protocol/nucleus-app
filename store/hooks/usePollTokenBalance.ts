import { useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { fetchAllTokenBalances } from '../slices/balance'
import { pollBalanceInterval } from '@/config/constants'

export function usePollTokenBalance() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAllTokenBalances({ ignoreLoading: true }))
    }, pollBalanceInterval)

    return () => clearInterval(interval)
  }, [dispatch])
}
