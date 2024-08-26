import { discordUrl, docsUrl } from '@/config/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectBridgesAsArray } from '@/store/slices/bridges'
import { Divider, Flex } from '@chakra-ui/react'
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
import { openTermsModal } from '@/store/slices/ui'
import { TokenIcon } from '../config/tokenIcons'

export function NavDrawer() {
  const bridges = useAppSelector(selectBridgesAsArray)
  const dispatch = useAppDispatch()

  function handleClickTermsAndConditions() {
    dispatch(openTermsModal())
  }

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
          <NavCollapse title="Bridge" leftIcon={<BridgeNavIcon />}>
            {bridges.map((bridge) => (
              <NavItem
                // ml={3}
                key={bridge.key}
                title={bridge.name}
                href={`/bridge/${bridge.key}`}
                disabled={bridge.comingSoon}
                comingSoon={bridge.comingSoon}
                // leftIcon={<TokenIcon tokenKey={bridge.nativeToken} />}
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
        <FooterLink title="Terms & Conditions" onClick={handleClickTermsAndConditions} icon={<TermsIcon />} />
      </Flex>
    </Flex>
  )
}
