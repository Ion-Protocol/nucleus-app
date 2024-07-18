import { getEthPerStEth } from '@/api/contracts/WstETH/stEthPerToken'
import { ChainKey } from '@/types/ChainKey'
import { Token } from '@/types/Token'

export enum TokenKey {
  ETH = 'eth',
  WETH = 'weth',
  WEETH = 'weETH',
  WSTETH = 'wstETH',
  SEI = 'sei',
  RSETH = 'rsETH',
  RSWETH = 'rswETH',
  EZETH = 'ezETH',
  MRPH = 'MRPH',
}

async function oneAsBigInt(): Promise<bigint> {
  return BigInt(1e18)
}

export const tokensConfig: Record<TokenKey, Token> = {
  [TokenKey.ETH]: {
    key: TokenKey.ETH,
    name: 'ETH',
    symbol: 'ETH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
    },
  },
  [TokenKey.WETH]: {
    key: TokenKey.WETH,
    name: 'Weth',
    symbol: 'WETH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x5f207d42F869fd1c71d7f0f81a2A67Fc20FF7323',
        getPrice: oneAsBigInt,
      },
    },
  },
  [TokenKey.WEETH]: {
    key: TokenKey.WEETH,
    name: 'weETH',
    symbol: 'WEETH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
    },
  },
  [TokenKey.WSTETH]: {
    key: TokenKey.WSTETH,
    name: 'wstETH',
    symbol: 'WSTETH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        getPrice: () => getEthPerStEth('0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'),
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        getPrice: () => getEthPerStEth('0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'),
      },
      [ChainKey.SEPOLIA]: {
        address: '0xB82381A3fBD3FaFA77B3a7bE693342618240067b',
        getPrice: () => getEthPerStEth('0xB82381A3fBD3FaFA77B3a7bE693342618240067b'),
      },
    },
  },
  [TokenKey.SEI]: {
    key: TokenKey.SEI,
    name: 'SEI',
    symbol: 'SEI',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0x9c1CB740f3b631ed53600058ae5B2f83E15d9fBF',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0x9c1CB740f3b631ed53600058ae5B2f83E15d9fBF',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
    },
  },
  [TokenKey.RSETH]: {
    key: TokenKey.RSETH,
    name: 'rsETH',
    symbol: 'RSETH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
    },
  },
  [TokenKey.RSWETH]: {
    key: TokenKey.RSWETH,
    name: 'rswETH',
    symbol: 'RSWETH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
    },
  },
  [TokenKey.EZETH]: {
    key: TokenKey.EZETH,
    name: 'ezETH',
    symbol: 'EZETH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0xbf5495efe5db9ce00f80364c8b423567e58d2110',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0xbf5495efe5db9ce00f80364c8b423567e58d2110',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
    },
  },
  [TokenKey.MRPH]: {
    key: TokenKey.MRPH,
    name: 'MRPH',
    symbol: 'MRPH',
    chains: {
      [ChainKey.MAINNET]: {
        address: '0x7B0C06043468469967DBA22d1AF33d77d44056c8',
        getPrice: oneAsBigInt,
      },
      [ChainKey.TENDERLY_MAINNET]: {
        address: '0x7B0C06043468469967DBA22d1AF33d77d44056c8',
        getPrice: oneAsBigInt,
      },
      [ChainKey.SEPOLIA]: {
        address: '0x',
        getPrice: oneAsBigInt,
      },
    },
  },
}
