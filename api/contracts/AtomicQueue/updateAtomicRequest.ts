import { wagmiConfig } from '@/config/wagmi'
import AtomicQueue from '@/contracts/AtomicQueue.json'
import { Abi, Address } from 'viem'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { allowance } from '../erc20/allowance'
import { approve } from '../erc20/approve'

export interface AtomicRequest {
  deadline: bigint
  atomicPrice: bigint
  offerAmount: bigint
  inSolve: boolean
}

export interface UpdateAtomicRequestParams {
  offer: Address
  want: Address
  userRequest: AtomicRequest
}

export interface UpdateAtomicRequestOptions {
  atomicQueueContractAddress: Address
  userAddress: Address
  chainId: number
}

export async function updateAtomicRequest(
  updateAtomicRequestParams: UpdateAtomicRequestParams,
  updateAtomicRequestOptions: UpdateAtomicRequestOptions
): Promise<{ txHash: `0x${string}` }> {
  const { offer, want, userRequest } = updateAtomicRequestParams
  const { deadline, atomicPrice, offerAmount, inSolve } = userRequest
  const { atomicQueueContractAddress, userAddress, chainId } = updateAtomicRequestOptions

  ////////////////////////////////
  // Check Allowance
  ////////////////////////////////
  const allowanceAsBigInt = await allowance({
    tokenAddress: offer,
    spenderAddress: atomicQueueContractAddress,
    userAddress,
  })

  ////////////////////////////////
  // Approve
  ////////////////////////////////
  if (offerAmount > allowanceAsBigInt) {
    await approve(
      {
        tokenAddress: offer,
        spenderAddress: atomicQueueContractAddress,
        amount: offerAmount,
      },
      { chainId }
    )
  }

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const txHash = await writeContract(wagmiConfig, {
    abi: AtomicQueue.abi as Abi,
    address: atomicQueueContractAddress,
    functionName: 'updateAtomicRequest',
    args: [offer, want, userRequest],
  })

  ////////////////////////////////
  // Wait for Transaction Receipt
  ////////////////////////////////
  await waitForTransactionReceipt(wagmiConfig, { hash: txHash, timeout: 60_000 })

  return { txHash }
}
