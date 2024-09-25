import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import TokenRouter from '@/contracts/TokenRouter.json'
import { allowance } from '../erc20/allowance'
import { approve } from '../erc20/approve'
import { wagmiConfig } from '@/config/wagmi'
import { Abi } from 'viem'

/**
 * @param {number} destination - The identifier of the destination chain.
 * @param {`0x${string}`} recipient - The address of the recipient on the destination chain.
 * @param {bigint} amount - The amount or identifier of tokens to be sent to the remote recipient.
 * @param {Object} options - Additional options.
 * @param {`0x${string}`} options.userAddress - The user's address.
 * @param {`0x${string}`} options.tokenRouterAddress - The address of the token router.
 * @param {`0x${string}`} options.bridgeAsset - The address of the bridge asset.
 * @returns {Promise<string>} messageId - The identifier of the dispatched message.
 */
export async function transferRemote(
  {
    destination,
    recipient,
    amount,
  }: {
    destination: number
    recipient: `0x${string}`
    amount: bigint
  },
  {
    userAddress,
    tokenRouterAddress,
    bridgeAsset,
  }: { userAddress: `0x${string}`; tokenRouterAddress: `0x${string}`; bridgeAsset: `0x${string}` }
) {
  ////////////////////////////////
  // Check Allowance
  ////////////////////////////////
  const allowanceAsBigInt = await allowance({
    tokenAddress: bridgeAsset,
    spenderAddress: tokenRouterAddress,
    userAddress,
  })

  ////////////////////////////////
  // Approve
  ////////////////////////////////
  if (amount > allowanceAsBigInt) {
    await approve(
      {
        tokenAddress: bridgeAsset,
        spenderAddress: tokenRouterAddress,
        amount,
      },
      { chainId: 1 }
    )
  }

  ////////////////////////////////
  // Simulate
  ////////////////////////////////
  try {
    await simulateContract(wagmiConfig, {
      abi: TokenRouter.abi as Abi,
      address: tokenRouterAddress,
      functionName: 'transferRemote',
      args: [destination, recipient, amount],
    })
  } catch (error) {
    console.log('simulateContract error!!!')
    console.error(error)
  }

  console.log('simulate passed!')

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const txHash = await writeContract(wagmiConfig, {
    abi: TokenRouter.abi as Abi,
    address: tokenRouterAddress,
    functionName: 'transferRemote',
    args: [destination, recipient, amount],
  })

  ////////////////////////////////
  // Wait for Transaction Receipt
  ////////////////////////////////
  await waitForTransactionReceipt(wagmiConfig, {
    hash: txHash,
    timeout: 60_000,
    confirmations: 1,
    pollingInterval: 10_000,
    retryCount: 5,
    retryDelay: 5_000,
  })
}
