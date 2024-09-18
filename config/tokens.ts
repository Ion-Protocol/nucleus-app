import { ChainKey } from '@/types/ChainKey'
import { Token } from '@/types/Token'
import { TokenKey } from '@/types/TokenKey'

export const tokensConfig: Record<TokenKey, Token> = {
  [TokenKey.ETH]: {
    key: TokenKey.ETH,
    name: 'ETH',
    symbol: 'ETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      [ChainKey.SEI]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  },
  [TokenKey.WETH]: {
    key: TokenKey.WETH,
    name: 'WETH',
    symbol: 'WETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [ChainKey.SEI]: '0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8',
    },
  },
  [TokenKey.WEETH]: {
    key: TokenKey.WEETH,
    name: 'weETH',
    symbol: 'WEETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
    },
  },
  [TokenKey.WSTETH]: {
    key: TokenKey.WSTETH,
    name: 'wstETH',
    symbol: 'WSTETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    },
  },
  [TokenKey.SEIYANETH]: {
    key: TokenKey.SEIYANETH,
    name: 'seiyanETH',
    symbol: 'SEI',
    addresses: {
      [ChainKey.ETHEREUM]: '0x9fAaEA2CDd810b21594E54309DC847842Ae301Ce',
      [ChainKey.SEI]: '0x9fAaEA2CDd810b21594E54309DC847842Ae301Ce',
    },
  },
  [TokenKey.RSETH]: {
    key: TokenKey.RSETH,
    name: 'rsETH',
    symbol: 'RSETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
    },
  },
  [TokenKey.RSWETH]: {
    key: TokenKey.RSWETH,
    name: 'rswETH',
    symbol: 'RSWETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0',
    },
  },
  [TokenKey.EZETH]: {
    key: TokenKey.EZETH,
    name: 'ezETH',
    symbol: 'EZETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xbf5495efe5db9ce00f80364c8b423567e58d2110',
    },
  },
  [TokenKey.OP]: {
    key: TokenKey.OP,
    name: 'Optimism',
    symbol: 'OP',
    addresses: {
      [ChainKey.ETHEREUM]: '0x',
    },
  },
  [TokenKey.WBTC]: {
    key: TokenKey.WBTC,
    name: 'WBTC',
    symbol: 'WBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    },
  },
  [TokenKey.SWBTC]: {
    key: TokenKey.SWBTC,
    name: 'SWBTC',
    symbol: 'SWBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0x8DB2350D78aBc13f5673A411D4700BCF87864dDE',
    },
  },
  [TokenKey.RSWBTC]: {
    key: TokenKey.RSWBTC,
    name: 'rswBTC',
    symbol: 'RSWBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0x215DC1cC32d9d08a0081e55E55895C8Cf006839a',
    },
  },
  [TokenKey.EARNBTC]: {
    key: TokenKey.EARNBTC,
    name: 'earnBTC',
    symbol: 'EARNBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0x215DC1cC32d9d08a0081e55E55895C8Cf006839a',
    },
  },
  [TokenKey.SSETH]: {
    key: TokenKey.SSETH,
    name: 'ssETH',
    fullName: 'Super Seiyan ETH',
    symbol: 'SSETH',
    addresses: {
      [ChainKey.SEI]: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
    },
  },
  [TokenKey.TETH]: {
    key: TokenKey.TETH,
    name: 'tETH',
    symbol: 'TETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x',
    },
  },
  [TokenKey.APXETH]: {
    key: TokenKey.APXETH,
    name: 'apxETH',
    symbol: 'APXETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x9Ba021B0a9b958B5E75cE9f6dff97C7eE52cb3E6',
    },
  },
  [TokenKey.PUFETH]: {
    key: TokenKey.PUFETH,
    name: 'pufETH',
    symbol: 'PUFETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xD9A442856C234a39a81a089C06451EBAa4306a72',
    },
  },
  [TokenKey.SFRXETH]: {
    key: TokenKey.SFRXETH,
    name: 'sfrxETH',
    symbol: 'SFRXETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xac3E018457B222d93114458476f3E3416Abbe38F',
    },
  },
  [TokenKey.SEI]: {
    key: TokenKey.SEI,
    name: 'Sei',
    symbol: 'SEI',
    addresses: {
      [ChainKey.ETHEREUM]: '0x',
    },
  },
  [TokenKey.DINERO]: {
    key: TokenKey.DINERO,
    name: 'Dinero',
    symbol: 'DINERO',
    addresses: {
      [ChainKey.ETHEREUM]: '0x6DF0E641FC9847c0c6Fde39bE6253045440c14d3',
    },
  },
}