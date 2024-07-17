import { wagmiConfig } from '@/config/wagmi'
import WstETH from '@/contracts/WstETH.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

/**
 * Retrieves the current exchange rate of ETH per stETH.
 * Note: The contract function name is misleading. It is not actually stETH per ETH, but ETH per stETH.
 * @returns The exchange rate of ETH per stETH as a bigint.
 */
export async function getEthPerStEth(contractAddress: `0x${string}`): Promise<bigint> {
  // The contract function name is misleading. It is not actually stETH per ETH, but ETH per stETH.
  const stEthPerTokenAsBigInt = (await readContract(wagmiConfig, {
    abi: WstETH.abi as Abi,
    address: contractAddress,
    functionName: 'stEthPerToken',
    args: [],
  })) as bigint

  return stEthPerTokenAsBigInt
}
