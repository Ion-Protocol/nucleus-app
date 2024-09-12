import { useAppDispatch } from '@/store/hooks'
import { setPath, setQuery } from '@/store/slices/router'
import { setBridgeNavOpen } from '@/store/slices/ui'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * The tokenChainMap is a temporary and hacky solution to map tokens to chains
 * for the url path. The reason for this is because we were using the chain in
 * the url path but now we are using that chains yield asset. Once I am able to
 * refactor everything, making the data token based instead of chain based, this
 * mapping will no longer be necessary.
 */
const tokenChainMap: Partial<Record<TokenKey, ChainKey>> = {
  [TokenKey.SSETH]: ChainKey.SEI,
}

/**
 * Custom hook to handle side effects based on route changes.
 * Dispatches an action to set the navigation drawer open state
 * when the route starts with '/tokens/'.
 */
export function useRouteChangeEffect() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Opens the bridge section of the navbar on the left of the screen when the route starts with '/tokens/'.
      if (url.startsWith('/tokens/')) {
        dispatch(setBridgeNavOpen(true))
      }

      dispatch(setPath(url))
      const query = router.query as { tokens: TokenKey }
      if (Object.keys(query).length > 0) {
        const chain = query.tokens ? tokenChainMap[query.tokens as TokenKey] : undefined
        const queryWithChain = { chain }
        dispatch(setQuery(queryWithChain))
      }
    }

    handleRouteChange(router.asPath)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [dispatch, router])
}
