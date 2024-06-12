import { Box, Text, Image, Flex } from '@chakra-ui/react'
import { Logo } from './Logo'
import { NavItem } from './NavItem'
import { DashboardIcon } from '../icons/Dashboard'
import { BridgeIcon } from '../icons/Bridge'
import { PortfolioIcon } from '../icons/Portfolio'
import NavCollapse from './NavCollapse'

export function NavDrawer() {
  return (
    <Box w="300px" borderRight="1px solid" borderColor="border" p={6}>
      <Logo />
      <Flex direction="column" mt={6} gap={1}>
        <NavItem title="Dashboard" href="/dashboard" leftIcon={<DashboardIcon />} />
        <NavCollapse title="Bridge" leftIcon={<BridgeIcon />}>
          <NavItem title="Swell" href="/bridge/swell" />
          <NavItem title="Arbitrum" href="/bridge/arbitrum" />
          <NavItem title="Edgeless" href="/bridge/edgeless" />
        </NavCollapse>
        <NavItem title="Portfolio (coming soon)" href="/portfolio" leftIcon={<PortfolioIcon />} disabled />
      </Flex>
    </Box>
  )
}
