import { TokenIcon } from '@/components/config/tokenIcons'
import { OpenNewTabIcon } from '@/components/shared/icons/OpenNewTab'
import { Divider, Flex, IconButton, Link, Text } from '@chakra-ui/react'
import { BridgeTitleConnector } from './connector'

function BridgeTitle({
  chainKey,
  yieldAssetName,
  yieldAssetKey,
  chainName,
  description,
  etherscanHref,
  ...props
}: BridgeTitleConnector.Props) {
  return (
    <Flex direction="column" align="center" justify="center" w="100%" gap={2} {...props}>
      <Flex align="center" gap={2} justify="center">
        {/* Font does not align perfectly with the icons, add margin top of -4px to compensate */}
        <TokenIcon tokenKey={yieldAssetKey} fontSize="32px" mt="-4px" />
        <Text ml={1} variant="heading2">
          Mint {yieldAssetName}
        </Text>
        <Text variant="heading2" color="disabledText">
          |
        </Text>
        <Text variant="heading2" color="disabledText">
          {chainName}
        </Text>
        {etherscanHref && (
          <Link href={etherscanHref} isExternal mt="-4px">
            <IconButton
              ml={-2}
              aria-label="Open in Etherscan"
              icon={<OpenNewTabIcon color="disabledText" />}
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
