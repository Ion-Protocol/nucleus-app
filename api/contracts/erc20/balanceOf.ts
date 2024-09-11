import { wagmiConfig } from '@/config/wagmi'
import { erc20Abi } from 'viem'
import { readContract } from 'wagmi/actions'

/**
 * Retrieves the balance of a specific address for a given ERC20 token.
 * @param balanceAddress The address for which the balance needs to be retrieved.
 * @param tokenAddress The address of the ERC20 token.
 * @param chainId The chain ID for the token (optional).
 * @returns The balance of the specified address as a BigInt.
 */
export async function balanceOf({
  balanceAddress,
  tokenAddress,
  chainId,
}: {
  balanceAddress: `0x${string}`
  tokenAddress: `0x${string}`
  chainId: number
}) {
  if (tokenAddress === '0x') {
    throw new Error(`Error calling balanceOf(): tokenAddress cannot be "0x".`)
  }
  try {
    const balanceOfAsBigInt = await readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: 'balanceOf',
      args: [balanceAddress],
      chainId,
    })
    return balanceOfAsBigInt
  } catch (error) {
    // Attach additional context to the error object
    const errorMessage = `chainId: ${chainId})\n`
    throw new Error(`${errorMessage}${error instanceof Error ? error.message : error}`)
  }
}
