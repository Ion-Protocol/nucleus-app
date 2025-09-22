import { ModalsContainer } from '@/components/shared/modals'
import { useChainChangeEffect } from '@/hooks/useChainChangeEffect'
import { useRouteChangeEffect } from '@/hooks/useRouteChangeEffect'
import { useStoreInitializer } from '@/store/hooks/useStoreInitializer'
import { useMediaQuery } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { DesktopLayout } from './DesktopLayout'
import { MobileLayout } from './MobileLayout'
import { TabletLayout } from './TabletLayout'
import { useTermsEffect } from '@/hooks/useTermsEffect'
import { useConnectEffect } from '@/hooks/useConnectEffect'
import { useFunkitThemeInitializer } from '@/styles/theme/hooks/useFunkitThemeInitializer'
import { usePollTokenBalance } from '@/store/hooks/usePollTokenBalance'
import { useDeprecationModal } from '@/hooks/useDeprecationModal'

export function Layout({ children }: PropsWithChildren) {
  useRouteChangeEffect()
  useChainChangeEffect()
  useConnectEffect()
  useTermsEffect()
  useStoreInitializer()
  useFunkitThemeInitializer()
  usePollTokenBalance()
  useDeprecationModal()

  const [isDesktop] = useMediaQuery('(min-width: 1025px)')
  const [isTablet] = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  let LayoutComponent = null

  if (isDesktop) {
    LayoutComponent = DesktopLayout
  } else if (isTablet) {
    LayoutComponent = TabletLayout
  } else if (isMobile) {
    LayoutComponent = MobileLayout
  }

  return (
    <>
      <ModalsContainer />
      {LayoutComponent && <LayoutComponent>{children}</LayoutComponent>}
    </>
  )
}
