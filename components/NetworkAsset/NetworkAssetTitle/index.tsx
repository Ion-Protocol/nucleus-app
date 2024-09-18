import { TokenIcon } from '@/components/config/tokenIcons'
import { OpenNewTabIcon } from '@/components/shared/icons/OpenNewTab'
import { Divider, Flex, IconButton, Link, Text } from '@chakra-ui/react'
import { NetworkAssetTitleConnector } from './connector'

function NetworkAssetTitle({
  networkAssetName,
  networkAssetFullName,
  networkAssetKey,
  description,
  etherscanHref,
  ...props
}: NetworkAssetTitleConnector.Props) {
  return (
    <Flex direction="column" align="center" justify="center" w="100%" gap={2} {...props}>
      <Flex align="center" gap={2} justify="center">
        {/* Font does not align perfectly with the icons, add margin top of -4px to compensate */}
        <TokenIcon tokenKey={networkAssetKey} fontSize="32px" mt="-4px" />
        <Text ml={1} variant="heading2">
          Mint {networkAssetFullName}
        </Text>
        <Text variant="heading2" color="disabledText">
          |
        </Text>
        <Text variant="heading2" color="disabledText">
          {networkAssetName}
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

export default NetworkAssetTitleConnector.Connector(NetworkAssetTitle)