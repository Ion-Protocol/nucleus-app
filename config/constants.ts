import { mainnet, type Chain } from 'wagmi/chains'
import { tenderlyStaging, sei, ethereumStagingL1, ethereumStagingL2 } from './tenderly'

export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as 'development' | 'staging' | 'production'

const testNetChains = [tenderlyStaging, ethereumStagingL1, ethereumStagingL2] as const

const prodChains = [mainnet, sei] as const

const allChains = [...prodChains, ...testNetChains] as const

export const SUPPORTED_CHAINS = (ENVIRONMENT === 'production' ? prodChains : allChains) as readonly [Chain, ...Chain[]]

export const docsUrl = 'https://docs.nucleusearn.io/'
export const discordUrl = 'https://discord.com/invite/CjQqUgPA6Y'
export const nativeAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const etherscanBaseUrl = 'https://etherscan.io/address/'
export const seiExplorerBaseUrl = 'https://seitrace.com/tx/'
export const layerZeroBaseUrl = 'https://layerzeroscan.com/tx/'
export const eclipseRpcUrl = 'https://mainnetbeta-rpc.eclipse.xyz'
export const redstoneBaseUrl = 'https://api.redstone.finance/'
export const hardcodedApy = 4 // 4%
export const msInOneYear = 31_556_952_000
export const mintSlippage = 0.005 // 0.5%
export const pollBalanceInterval = 30_000 // 30 seconds
export const pollBalanceAfterTransactionInterval = 10_000 // 10 seconds
export const pollBalanceAfterTransactionAttempts = 12 // 2 minutes worth of attempts
export const hyperlaneIdForEclipse = 1408864445
