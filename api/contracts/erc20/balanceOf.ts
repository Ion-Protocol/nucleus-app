import { wagmiConfig } from '@/config/wagmi'
import { erc20Abi } from 'viem'
import { readContract } from 'wagmi/actions'

/**
 * Retrieves the balance of a specific address for a given ERC20 token.
 * @param balanceAddress The address for which the balance needs to be retrieved.
 * @param tokenAddress The address of the ERC20 token.
 * @returns The balance of the specified address as a BigInt.
 */
export async function balanceOf({
  balanceAddress,
  tokenAddress,
}: {
  balanceAddress: `0x${string}`
  tokenAddress: `0x${string}`
}) {
  if (tokenAddress === '0x0') {
    throw new Error(`Error calling balanceOf(): tokenAddress cannot be "0x0".`)
  }

  const balanceOfAsBigInt = await readContract(wagmiConfig, {
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [balanceAddress],
  })

  return balanceOfAsBigInt
}
