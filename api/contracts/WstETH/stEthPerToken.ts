import { wagmiConfig } from '@/config/wagmi'
import { readContract } from 'wagmi/actions'
import WstETH from '@/contracts/WstETH.json'
import { Abi } from 'viem'
import { tokensConfig } from '@/config/token'

/**
 * Retrieves the current exchange rate of ETH per stETH.
 * Note: The contract function name is misleading. It is not actually stETH per ETH, but ETH per stETH.
 * @returns The exchange rate of ETH per stETH as a bigint.
 */
export async function getEthPerStEth(): Promise<bigint> {
  const wstEthAddress = tokensConfig.wsteth.address

  // The contract function name is misleading. It is not actually stETH per ETH, but ETH per stETH.
  const stEthPerTokenAsBigInt = (await readContract(wagmiConfig, {
    abi: WstETH.abi as Abi,
    address: wstEthAddress,
    functionName: 'stEthPerToken',
    args: [],
  })) as bigint

  return stEthPerTokenAsBigInt
}
