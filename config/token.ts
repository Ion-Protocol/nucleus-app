import { ChainKey } from '@/types/ChainKey'
import { Token } from '@/types/Token'
import { TokenKey } from '@/types/TokenKey'
import { mainnet, sei } from 'wagmi/chains'

export const tokensConfig: Record<TokenKey, Token> = {
  [TokenKey.ETH]: {
    key: TokenKey.ETH,
    name: 'ETH',
    symbol: 'ETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: mainnet.id,
      },
      [ChainKey.SEI]: {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.WETH]: {
    key: TokenKey.WETH,
    name: 'WETH',
    symbol: 'WETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        chainId: mainnet.id,
      },
      [ChainKey.SEI]: {
        address: '0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8',
        chainId: sei.id,
      },
    },
  },
  [TokenKey.WEETH]: {
    key: TokenKey.WEETH,
    name: 'weETH',
    symbol: 'WEETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.WSTETH]: {
    key: TokenKey.WSTETH,
    name: 'wstETH',
    symbol: 'WSTETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.SEIYANETH]: {
    key: TokenKey.SEIYANETH,
    name: 'seiyanETH',
    symbol: 'SEI',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0x9fAaEA2CDd810b21594E54309DC847842Ae301Ce',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.RSETH]: {
    key: TokenKey.RSETH,
    name: 'rsETH',
    symbol: 'RSETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.RSWETH]: {
    key: TokenKey.RSWETH,
    name: 'rswETH',
    symbol: 'RSWETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.EZETH]: {
    key: TokenKey.EZETH,
    name: 'ezETH',
    symbol: 'EZETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0xbf5495efe5db9ce00f80364c8b423567e58d2110',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.OP]: {
    key: TokenKey.OP,
    name: 'Optimism',
    symbol: 'OP',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0x',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.WBTC]: {
    key: TokenKey.WBTC,
    name: 'WBTC',
    symbol: 'WBTC',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.SWBTC]: {
    key: TokenKey.SWBTC,
    name: 'SWBTC',
    symbol: 'SWBTC',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0x8DB2350D78aBc13f5673A411D4700BCF87864dDE',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.RSWBTC]: {
    key: TokenKey.RSWBTC,
    name: 'rswBTC',
    symbol: 'RSWBTC',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0x215DC1cC32d9d08a0081e55E55895C8Cf006839a',
        chainId: mainnet.id,
      },
    },
  },
  [TokenKey.SSETH]: {
    key: TokenKey.SSETH,
    name: 'ssETH',
    symbol: 'SSETH',
    chains: {
      [ChainKey.ETHEREUM]: {
        address: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
        chainId: mainnet.id,
      },
    },
  },
}
