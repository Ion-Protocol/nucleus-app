import { ChainIcon } from '@/components/config/chainIcons'
import { Flex, IconButton, Link, Text } from '@chakra-ui/react'
import { BridgeTitleConnector } from './connector'
import { OpenNewTabIcon } from '@/components/shared/icons/OpenNewTab'
import { TokenIcon } from '@/components/config/tokenIcons'

function BridgeTitle({
  chainKey,
  yieldAssetName,
  yieldAssetKey,
  description,
  etherscanHref,
  ...props
}: BridgeTitleConnector.Props) {
  return (
    <Flex direction="column" align="center" justify="center" w="100%" gap={2} {...props}>
      <Flex align="center" gap={3} justify="center">
        {/* Font does not align perfectly with the icons, add margin top of 4px to compensate */}
        <Text variant="heading2" mt="4px">
          Mint {yieldAssetName}
        </Text>
        <TokenIcon tokenKey={yieldAssetKey} fontSize="32px" />
        {etherscanHref && (
          <Link href={etherscanHref} isExternal>
            <IconButton
              ml={-2}
              aria-label="Open in Etherscan"
              icon={<OpenNewTabIcon color="textSecondary" />}
              variant="ghost"
              size="sm"
            />
          </Link>
        )}
      </Flex>
      <Text variant="smallParagraph">{description}</Text>
    </Flex>
  )
}

export default BridgeTitleConnector.Connector(BridgeTitle)
