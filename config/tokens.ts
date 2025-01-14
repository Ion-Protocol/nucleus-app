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
      [ChainKey.RARI]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    coinGeckoId: 'ethereum',
  },
  [TokenKey.WETH]: {
    key: TokenKey.WETH,
    name: 'WETH',
    symbol: 'WETH',
    fullName: 'Wrapped ETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [ChainKey.SEI]: '0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8',
      [ChainKey.RARI]: '0xf037540e51d71b2d2b1120e8432ba49f29edfbd0',
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
  [TokenKey.EARNETH]: {
    key: TokenKey.EARNETH,
    name: 'earnETH',
    fullName: 'Earn ETH',
    symbol: 'EARNETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
    },
  },
  [TokenKey.SSETH]: {
    key: TokenKey.SSETH,
    name: 'ssETH',
    fullName: 'Super Seiyan ETH',
    symbol: 'SSETH',
    addresses: {
      [ChainKey.SEI]: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
      [ChainKey.ETHEREUM]: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
    },
  },
  [TokenKey.TETH]: {
    key: TokenKey.TETH,
    name: 'tETH',
    fullName: 'Turbo ETH',
    symbol: 'TETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
      [ChainKey.ECLIPSE]: 'GU7NS9xCwgNPiAdJ69iusFrRfawjDDPjeMBovhV1d4kn', // SPL token format on Solana
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
  [TokenKey.UNIFIETH]: {
    key: TokenKey.UNIFIETH,
    name: 'unifiETH',
    symbol: 'UNIFIETH',
    addresses: {
      [ChainKey.UNIFI]: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
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
    coinGeckoId: 'sei-network',
  },
  [TokenKey.DINERO]: {
    key: TokenKey.DINERO,
    name: 'Dinero',
    symbol: 'DINERO',
    addresses: {
      // [ChainKey.ETHEREUM]: '0x09D9420332bff75522a45FcFf4855F82a0a3ff50',
      [ChainKey.SEI]: '0x09D9420332bff75522a45FcFf4855F82a0a3ff50', // https://seitrace.com/address/0x09D9420332bff75522a45FcFf4855F82a0a3ff50?chain=pacific-1
    },
  },
  [TokenKey.FETH]: {
    key: TokenKey.FETH,
    name: 'FETH',
    fullName: 'Form ETH',
    symbol: 'FETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
    },
  },
  [TokenKey.PZETH]: {
    key: TokenKey.PZETH,
    name: 'pzETH',
    symbol: 'PZETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811',
    },
  },
  [TokenKey.RARI]: {
    key: TokenKey.RARIETH,
    name: 'rari',
    symbol: 'RARI',
    fullName: 'Rari ETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
    },
  },
  [TokenKey.RARIETH]: {
    key: TokenKey.RARIETH,
    name: 'rariETH',
    symbol: 'RARIETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
      [ChainKey.RARI]: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
    },
  },
  [TokenKey.ISEI]: {
    key: TokenKey.ISEI,
    name: 'iSEI',
    symbol: 'iSEI',
    addresses: {
      // [ChainKey.ETHEREUM]: '0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423',
      [ChainKey.SEI]: '0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423', // https://seitrace.com/token/0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423?chain=pacific-1
    },
    rateOracles: {
      // For getting the iSEI/USD rate on SEI
      // https://seitrace.com/address/0xC49F0Dd98F38C525A7ce15E73E60675456F3a161?chain=pacific-1&contract=read_proxy&slug=&tab=contract
      // https://docs.redstone.finance/docs/get-started/price-feeds
      [ChainKey.SEI]: '0xC49F0Dd98F38C525A7ce15E73E60675456F3a161',
    },
  },
}
