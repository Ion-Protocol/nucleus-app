import { wagmiConfig } from '@/config/wagmi'
import { erc20Abi } from 'viem'
import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'

/**
 * Approves the spender to spend the specified amount of tokens from the token owner's account.
 *
 * @param options - The options for the approval.
 * @param options.tokenAddress - The address of the token.
 * @param options.spenderAddress - The address of the spender.
 * @param options.amount - The amount of tokens to be approved.
 * @returns A promise that resolves to the transaction receipt.
 */
export async function approve(
  {
    tokenAddress,
    spenderAddress,
    amount,
  }: {
    tokenAddress: `0x${string}`
    spenderAddress: `0x${string}`
    amount: bigint
  },
  { chainId }: { chainId: number }
) {
  // Simulate the transaction to catch any errors
  await simulateContract(wagmiConfig, {
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'approve',
    args: [spenderAddress, amount],
    chainId,
  })

  // Approve the spender
  const hash = await writeContract(wagmiConfig, {
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'approve',
    args: [spenderAddress, amount],
  })

  // Wait for the transaction to be confirmed
  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    hash: hash,
  })

  return receipt
}
