import { useMediaQuery } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { DesktopLayout } from '../DesktopLayout'
import { MobileLayout } from './MobileLayout'
import { TabletLayout } from './TabletLayout'
import { useRouteChangeEffect } from '@/hooks/useRouteChangeEffect'

export function Layout({ children }: PropsWithChildren) {
  useRouteChangeEffect()

  const [isDesktop] = useMediaQuery('(min-width: 1025px)')
  const [isTablet] = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  if (isDesktop) {
    return <DesktopLayout>{children}</DesktopLayout>
  } else if (isTablet) {
    return <TabletLayout>{children}</TabletLayout>
  } else if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>
  }
}
