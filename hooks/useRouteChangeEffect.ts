import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/store/hooks'
import { setBridgeNavOpen } from '@/store/slices/ui'
import { RouterQuery, setPath, setQuery } from '@/store/slices/router'

/**
 * Custom hook to handle side effects based on route changes.
 * Dispatches an action to set the navigation drawer open state
 * when the route starts with '/bridge/'.
 */
export function useRouteChangeEffect() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.startsWith('/bridge/')) {
        dispatch(setBridgeNavOpen(true))
      }
      dispatch(setPath(url))
      const query = router.query as RouterQuery
      dispatch(setQuery(query))
    }

    handleRouteChange(router.asPath)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [dispatch, router])
}
