import { wagmiConfig } from '@/config/wagmi'
import { erc20Abi } from 'viem'
import { readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'

/**
 * Retrieves the allowance of a spender for a specific token.
 *
 * @param tokenAddress - The address of the token contract.
 * @param spenderAddress - The address of the spender.
 * @param userAddress - The address of the user.
 * @returns The allowance as a BigInt.
 */
export async function allowance({
  tokenAddress,
  spenderAddress,
  userAddress,
}: {
  tokenAddress: `0x${string}`
  spenderAddress: `0x${string}`
  userAddress: `0x${string}`
}) {
  const allowanceAsBigInt = await readContract(wagmiConfig, {
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'allowance',
    args: [userAddress, spenderAddress],
  })

  return allowanceAsBigInt
}
