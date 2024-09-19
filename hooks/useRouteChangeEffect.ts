import { useAppDispatch } from '@/store/hooks'
import { setPath, setQuery, setRouterReady } from '@/store/slices/router'
import { setNetworkAssetNavOpen } from '@/store/slices/ui'
import { TokenKey } from '@/types/TokenKey'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * Custom hook to handle side effects based on route changes.
 * Dispatches an action to set the navigation drawer open state
 * when the route starts with '/tokens/'.
 */
export function useRouteChangeEffect() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      dispatch(setRouterReady(router.isReady))

      // Opens the network assaet section of the navbar on the left of the screen when the route starts with '/tokens/'.
      if (url.startsWith('/tokens/')) {
        dispatch(setNetworkAssetNavOpen(true))
      }

      dispatch(setPath(url))
      const query = router.query as { tokens: TokenKey }
      if (Object.keys(query).length > 0) {
        dispatch(setQuery({ token: query.tokens }))
        localStorage.setItem('networkAsset', query.tokens)
      }
    }

    handleRouteChange(router.asPath)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [dispatch, router])
}
