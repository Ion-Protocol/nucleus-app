import { discordUrl, docsUrl } from '@/config/constants'
import { Divider, Flex } from '@chakra-ui/react'
import { TokenIcon } from '../config/tokenIcons'
import { BridgeNavIcon } from '../shared/icons/Bridge'
import { DashboardIcon } from '../shared/icons/Dashboard'
import { DiscordIcon } from '../shared/icons/Discord'
import { DocsIcon } from '../shared/icons/Docs'
import { PortfolioIcon } from '../shared/icons/Portfolio'
import { TermsIcon } from '../shared/icons/Terms'
import { FooterLink } from './FooterLink'
import { Logo } from './Logo'
import NavCollapse from './NavCollapse'
import { NavItem } from './NavItem'
import { NavDrawerConnector } from './connector'
import { tokensConfig } from '@/config/token'

function NavDrawer({ chains, openTermsModal }: NavDrawerConnector.Props) {
  return (
    <Flex
      direction="column"
      minW="300px"
      maxW="300px"
      borderRight="1px solid"
      borderColor="border"
      p={6}
      justify="space-between"
      bg="drawerBackground"
    >
      <Flex direction="column" flex={1}>
        <Logo />
        <Flex direction="column" mt={6} gap={1}>
          <NavItem title="Dashboard" href="/dashboard" leftIcon={<DashboardIcon />} />
          <NavCollapse title="Mint" leftIcon={<BridgeNavIcon />}>
            {chains.map((chain) => (
              <NavItem
                key={chain.key}
                title={tokensConfig[chain.yieldAsset].name}
                href={`/tokens/${chain.yieldAsset}`}
                disabled={chain.comingSoon}
                comingSoon={chain.comingSoon}
                leftIcon={<TokenIcon tokenKey={chain.yieldAsset} />}
              />
            ))}
          </NavCollapse>
          <NavItem title="Portfolio" href="/portfolio" leftIcon={<PortfolioIcon />} disabled comingSoon />
        </Flex>
      </Flex>
      <Divider />
      <Flex pt={6} direction="column">
        <FooterLink title="Docs" href={docsUrl} icon={<DocsIcon />} openNewTab />
        <FooterLink title="Discord" href={discordUrl} icon={<DiscordIcon />} openNewTab />
        <FooterLink title="Terms & Conditions" onClick={openTermsModal} icon={<TermsIcon />} />
      </Flex>
    </Flex>
  )
}

export default NavDrawerConnector.Connector(NavDrawer)
