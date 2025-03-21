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
      // [ChainKey.FORM]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
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
      [ChainKey.BOBA]: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      [ChainKey.FORM]: '0xb1b812b664c28E1bA1d35De925Ae88b7Bc7cdCF5', // Found on explorer but form doesn't list WETH on their bridge
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
      // [ChainKey.SWELL]: '0x215DC1cC32d9d08a0081e55E55895C8Cf006839a', // ! causes error in fetch balances
    },
  },
  [TokenKey.EARNETH]: {
    key: TokenKey.EARNETH,
    name: 'earnETH',
    fullName: 'Earn ETH',
    symbol: 'EARNETH',
    addresses: {
      [ChainKey.ETHEREUM]: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
      [ChainKey.SWELL]: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
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
      [ChainKey.ETHEREUM]: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
      [ChainKey.UNIFI]: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
    },
  },
  [TokenKey.UNIFIBTC]: {
    key: TokenKey.UNIFIBTC,
    name: 'unifiBTC',
    symbol: 'UNIFIBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0x170d847a8320f3b6a77ee15b0cae430e3ec933a0',
      [ChainKey.UNIFI]: '0x170d847a8320f3b6a77ee15b0cae430e3ec933a0',
    },
  },
  [TokenKey.UNIFIUSD]: {
    key: TokenKey.UNIFIUSD,
    name: 'unifiUSD',
    symbol: 'UNIFIUSD',
    addresses: {
      [ChainKey.ETHEREUM]: '0x82c40e07277eBb92935f79cE92268F80dDc7caB4',
    },
  },
  [TokenKey.LBTC]: {
    key: TokenKey.LBTC,
    name: 'lBTC',
    symbol: 'LBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0x8236a87084f8b84306f72007f36f2618a5634494',
    },
  },
  [TokenKey.PUMPBTC]: {
    key: TokenKey.PUMPBTC,
    name: 'pumpBTC',
    symbol: 'PUMPBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0xf469fbd2abcd6b9de8e169d128226c0fc90a012e',
    },
  },
  [TokenKey.CBBTC]: {
    key: TokenKey.CBBTC,
    name: 'cbBTC',
    symbol: 'CBBTC',
    addresses: {
      [ChainKey.ETHEREUM]: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
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
      [ChainKey.FORM]: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
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
  [TokenKey.BOBAETH]: {
    key: TokenKey.BOBAETH,
    name: 'bobaETH',
    fullName: 'Boba ETH',
    symbol: 'BOBAETH',
    addresses: {
      [ChainKey.BOBA]: '0x52E4d8989fa8b3E1C06696e7b16DEf5d7707A0d1',
      [ChainKey.ETHEREUM]: '0x52E4d8989fa8b3E1C06696e7b16DEf5d7707A0d1',
    },
  },
  [TokenKey.NELIXIR]: {
    key: TokenKey.NELIXIR,
    name: 'nELIXIR',
    symbol: 'NELIXIR',
    addresses: {
      [ChainKey.ETHEREUM]: '0x9fbc367b9bb966a2a537989817a088afcaffdc4c',
      [ChainKey.PLUME]: '0x9fbc367b9bb966a2a537989817a088afcaffdc4c',
    },
  },
  [TokenKey.SUPUSD]: {
    key: TokenKey.SUPUSD,
    name: 'supUSD',
    symbol: 'SUPUSD',
    addresses: {
      [ChainKey.ETHEREUM]: '0x61465652cceb2c63b17c56a3f5646566c753eeff',
    },
  },
  [TokenKey.USN]: {
    key: TokenKey.USN,
    name: 'USN',
    symbol: 'USN',
    addresses: {
      [ChainKey.ETHEREUM]: '0xdA67B4284609d2d48e5d10cfAc411572727dc1eD',
    },
  },
  [TokenKey.SUSN]: {
    key: TokenKey.SUSN,
    name: 'sUSN',
    symbol: 'SUSN',
    addresses: {
      [ChainKey.ETHEREUM]: '0xE24a3DC889621612422A64E6388927901608B91D',
    },
  },
}
