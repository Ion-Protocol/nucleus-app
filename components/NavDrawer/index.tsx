import { Box, Text, Image, Flex } from '@chakra-ui/react'
import { Logo } from './Logo'
import { NavItem } from './NavItem'
import { DashboardIcon } from '../icons/Dashboard'
import { BridgeIcon } from '../icons/Bridge'
import { PortfolioIcon } from '../icons/Portfolio'
import NavCollapse from './NavCollapse'
import { bridgesConfig } from '@/config/bridges'
import { BridgeKey } from '@/types/Bridge'

export function NavDrawer() {
  const bridges = Object.keys(bridgesConfig) as BridgeKey[]

  return (
    <Box minW="300px" maxW="300px" borderRight="1px solid" borderColor="border" p={6}>
      <Logo />
      <Flex direction="column" mt={6} gap={1}>
        <NavItem title="Dashboard" href="/dashboard" leftIcon={<DashboardIcon />} />
        <NavCollapse title="Bridge" leftIcon={<BridgeIcon />}>
          {bridges.map((key) => (
            <NavItem key={key} title={bridgesConfig[key].name} href={`/bridge/${key}`} />
          ))}
        </NavCollapse>
        <NavItem title="Portfolio (coming soon)" href="/portfolio" leftIcon={<PortfolioIcon />} disabled />
      </Flex>
    </Box>
  )
}
