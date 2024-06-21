import { Box, Text, Image, Flex, Divider } from '@chakra-ui/react'
import { Logo } from './Logo'
import { NavItem } from './NavItem'
import { DashboardIcon } from '../shared/icons/Dashboard'
import { BridgeNavIcon } from '../shared/icons/Bridge'
import { PortfolioIcon } from '../shared/icons/Portfolio'
import NavCollapse from './NavCollapse'
import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { DocsIcon } from '../shared/icons/Docs'
import { DiscordIcon } from '../shared/icons/Discord'
import { TermsIcon } from '../shared/icons/Terms'
import { OpenNewTabIcon } from '../shared/icons/OpenNewTab'
import { FooterLink } from './FooterLink'

export function NavDrawer() {
  const bridges = Object.keys(bridgesConfig) as BridgeKey[]

  return (
    <Flex
      direction="column"
      minW="300px"
      maxW="300px"
      borderRight="1px solid"
      borderColor="border"
      p={6}
      justify="space-between"
    >
      <Flex direction="column" flex={1}>
        <Logo />
        <Flex direction="column" mt={6} gap={1}>
          <NavItem title="Dashboard" href="/dashboard" leftIcon={<DashboardIcon />} />
          <NavCollapse title="Bridge" leftIcon={<BridgeNavIcon />}>
            {bridges.map((key) => (
              <NavItem key={key} title={bridgesConfig[key].name} href={`/bridge/${key}`} />
            ))}
          </NavCollapse>
          <NavItem title="Portfolio (coming soon)" href="/portfolio" leftIcon={<PortfolioIcon />} disabled />
        </Flex>
      </Flex>
      <Divider />
      <Flex pt={6} direction="column">
        <FooterLink title="Docs" href="https://docs.ionbridge.io" icon={<DocsIcon />} openNewTab />
        <FooterLink title="Discord" href="https://discord.gg/2Y9F2xh" icon={<DiscordIcon />} openNewTab />
        <FooterLink title="Terms & Conditions" icon={<TermsIcon />} />
      </Flex>
    </Flex>
  )
}
