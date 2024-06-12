import { PropsWithChildren } from 'react'
import { Flex } from '@chakra-ui/react'
import { NavDrawer } from '@/components/NavDrawer'
import { AppHeader } from '@/components/AppHeader'

export function DesktopLayout({ children }: PropsWithChildren) {
  return (
    <Flex height="100vh" overflow="hidden">
      <NavDrawer />
      <Flex direction="column" flex={1} height="100vh">
        <AppHeader />
        <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      </Flex>
    </Flex>
  )
}
