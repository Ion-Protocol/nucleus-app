import { TokenIcon } from '@/components/config/tokenIcons'
import { tokensConfig } from '@/config/tokens'
import { TokenKey } from '@/types/TokenKey'
import { Text, Flex } from '@chakra-ui/react'
import { TelescopeIcon } from 'lucide-react'

const mockData = {
  multipliers: [
    {
      tokenKey: TokenKey.ETH,
      value: 3,
    },
    {
      tokenKey: TokenKey.WBTC,
      value: 1.5,
    },
  ],
  tokens: [
    {
      tokenKey: TokenKey.ETH,
      value: 128.2,
    },
    {
      tokenKey: TokenKey.WBTC,
      value: 67.9,
    },
    {
      tokenKey: TokenKey.SSETH,
      value: 48.6,
    },
  ],

  apy: [
    {
      tokenKey: TokenKey.SSETH,
      value: 3.92,
    },
    {
      tokenKey: TokenKey.FETH,
      value: 0.45,
    },
  ],

  netApy: 9.92,
}

export function AssetTooltip() {
  return (
    <Flex direction="column" gap={3}>
      {/* Multipliers */}
      <Flex direction="column" gap={1}>
        <Text variant="body-14" color="element.subdued">
          Multipliers
        </Text>
        <Flex border="1px solid" borderColor="stroke.main" borderRadius="8px" p={2} direction="column" gap={2}>
          {mockData.multipliers.map((multiplier) => (
            <Flex key={multiplier.tokenKey} align="center" justify="space-between">
              <Flex gap={1} align="center">
                <TokenIcon tokenKey={multiplier.tokenKey} fontSize={16} />
                <Text variant="body-14" color="element.subdued">
                  {tokensConfig[multiplier.tokenKey].symbol}
                </Text>
              </Flex>
              <Text variant="body-14" color="element.violet">
                x{multiplier.value.toFixed(1)}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Tokens */}
      <Flex direction="column" gap={1}>
        <Text variant="body-14" color="element.subdued">
          Tokens
        </Text>
        <Flex border="1px solid" borderColor="stroke.main" borderRadius="8px" p={2} direction="column" gap={2}>
          {mockData.tokens.map((token) => (
            <Flex key={token.tokenKey} align="center" justify="space-between">
              <Flex gap={1} align="center">
                <TokenIcon tokenKey={token.tokenKey} fontSize={16} />
                <Text variant="body-14" color="element.subdued">
                  {tokensConfig[token.tokenKey].symbol}
                </Text>
              </Flex>
              <Text variant="body-14" color="element.violet">
                +{token.value.toFixed(1)}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* APY */}
      <Flex direction="column" gap={1}>
        <Text variant="body-14" color="element.subdued">
          APY
        </Text>
        <Flex border="1px solid" borderColor="stroke.main" borderRadius="8px" p={2} direction="column" gap={2}>
          {mockData.apy.map((apy) => (
            <Flex key={apy.tokenKey} align="center" justify="space-between">
              <Flex gap={1} align="center">
                <TokenIcon tokenKey={apy.tokenKey} fontSize={16} />
                <Text variant="body-14" color="element.subdued">
                  {tokensConfig[apy.tokenKey].symbol}
                </Text>
              </Flex>
              <Text variant="body-14" color="element.violet">
                {apy.value.toFixed(2)}%
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Net APY */}
      <Flex
        border="1px solid"
        borderColor="stroke.main"
        borderRadius="8px"
        p={2}
        color="element.violet"
        justify="space-between"
      >
        <Flex align="center" gap={1}>
          <TelescopeIcon />
          <Text variant="body-16">Net APY</Text>
        </Flex>
        <Text variant="body-16">{mockData.netApy.toFixed(2)}%</Text>
      </Flex>
    </Flex>
  )
}
