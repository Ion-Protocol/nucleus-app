import { Flex } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export function MobileLayout({ children }: PropsWithChildren) {
  return (
    <main style={{ flex: 1, overflowY: 'auto' }}>
      <Flex>{children}</Flex>
    </main>
  )
}
