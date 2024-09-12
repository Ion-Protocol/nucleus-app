import { AppHeader } from '@/components/AppHeader'
import NavDrawer from '@/components/NavDrawer'
import { Flex } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export function TabletLayout({ children }: PropsWithChildren) {
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
