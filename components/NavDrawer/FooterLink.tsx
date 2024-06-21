import { Flex, Link, Text } from '@chakra-ui/react'
import { OpenNewTabIcon } from '../shared/icons/OpenNewTab'

interface FooterLinkProps {
  title: string
  href?: string
  onClick?: () => void
  icon: React.ReactNode
  openNewTab?: boolean
}

export function FooterLink({ title, href, icon, openNewTab, onClick }: FooterLinkProps) {
  return (
    <Link href={href} isExternal={openNewTab} _hover={{ textDecoration: 'none' }} onClick={onClick}>
      <Flex py={2} px={3} align="center" justify="space-between" _hover={{ background: 'hover' }} cursor="pointer">
        <Flex align="center" gap={3}>
          {icon}
          <Text variant="large">{title}</Text>
        </Flex>
        {openNewTab && <OpenNewTabIcon fontSize="12px" />}
      </Flex>
    </Link>
  )
}
