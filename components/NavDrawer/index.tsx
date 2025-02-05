import { discordUrl, docsUrl } from '@/config/constants'
import { Divider, Flex, chakra, useColorMode } from '@chakra-ui/react'
import { BookOpen01, CoinsStacked02, Compass02, File02, LogOut04 } from '@untitled-ui/icons-react'
import { DiscordOutline } from '../shared/icons/DiscordOutline'
// import { PortfolioIcon } from '../shared/icons/Portfolio'
import { NavDrawerConnector } from './connector'
import { Logo } from './Logo'
import { NavItem } from './NavItem'

export const CompassIcon = chakra(Compass02)
export const LogOutIcon = chakra(LogOut04)
export const PortfolioIcon = chakra(CoinsStacked02)
function NavDrawer({ networkAssets, openTermsModal }: NavDrawerConnector.Props) {
  const { colorMode } = useColorMode()

  return (
    <Flex
      as="nav"
      direction="column"
      minW="240px"
      maxW="240px"
      borderRight="1px solid"
      borderColor="stroke.main"
      justify="space-between"
      bg="bg.main"
      bgImage={
        colorMode === 'light'
          ? `url('/assets/images/navbar-texture-bg-light.webp')`
          : `url('/assets/images/navbar-texture-bg-dark.webp')`
      }
      bgSize="100% 100%"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Flex direction="column" flex={1}>
        <Logo />
        <Divider />
        <NavItem title="Explore" href="/dashboard" leftIcon={CompassIcon} />
        {/* <NavCollapse title="Mint" leftIcon={<NetworkAssetNavIcon />}> */}
        {/* {networkAssets.map((networkAsset) => (
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
            ))} */}
        {/* </NavCollapse> */}
        {/* TODO: Reorder these items when portfolio is implemented */}
        <NavItem title="Withdrawals" href="/withdrawals" leftIcon={LogOutIcon} />
        <NavItem disabled title="Portfolio" href="/portfolio" leftIcon={PortfolioIcon} comingSoon />
      </Flex>
      {/* ! Commented out while we build onboarding flow and way to track user progress */}
      {/* <Divider />
      <GetStarted /> */}
      <Divider />
      <NavItem title="Docs" href={docsUrl} leftIcon={BookOpen01} isExternal />
      <NavItem title="Discord" href={discordUrl} leftIcon={DiscordOutline} isExternal />
      <NavItem title="Terms & Conditions" onClick={openTermsModal} leftIcon={File02} />
    </Flex>
  )
}

export default NavDrawerConnector.Connector(NavDrawer)
