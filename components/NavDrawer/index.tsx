import { discordUrl, docsUrl } from '@/config/constants'
import { Divider, Flex } from '@chakra-ui/react'
import { CircleArrowRight } from 'lucide-react'
import { TokenIcon } from '../config/tokenIcons'
import { DashboardIcon } from '../shared/icons/Dashboard'
import { DiscordIcon } from '../shared/icons/Discord'
import { DocsIcon } from '../shared/icons/Docs'
import { NetworkAssetNavIcon } from '../shared/icons/NetworkAsset'
import { PortfolioIcon } from '../shared/icons/Portfolio'
import { TermsIcon } from '../shared/icons/Terms'
import { FooterLink } from './FooterLink'
import { Logo } from './Logo'
import NavCollapse from './NavCollapse'
import { NavItem } from './NavItem'
import { NavDrawerConnector } from './connector'

function NavDrawer({ networkAssets, openTermsModal }: NavDrawerConnector.Props) {
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
          <NavCollapse title="Mint" leftIcon={<NetworkAssetNavIcon />}>
            {networkAssets.map((networkAsset) => (
              <NavItem
                key={networkAsset.key}
                title={networkAsset.token.name}
                href={`/tokens/${networkAsset.token.name.toLowerCase()}`}
                disabled={networkAsset.comingSoon}
                comingSoon={networkAsset.comingSoon}
                leftIcon={<TokenIcon tokenKey={networkAsset.token.key} />}
                isExternal={networkAsset.isExternal}
                partnerUrl={networkAsset.partnerUrl}
              />
            ))}
          </NavCollapse>
          <NavItem title="Withdrawals" href="/withdrawals" leftIcon={<CircleArrowRight />} />
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
