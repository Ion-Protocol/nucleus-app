import { wagmiConfig } from '@/config/wagmi'
import MerkleClaimAbi from '@/contracts/MerkleClaim.json'
import { Abi, Address } from 'viem'
import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'

export async function claim(
  {
    proof,
    user,
    assets,
    totalClaimableForAsset,
  }: { proof: string[]; user: Address; assets: Address[]; totalClaimableForAsset: bigint[] },
  { merkleClaimContractAddress }: { merkleClaimContractAddress: Address }
) {
  ////////////////////////////////
  // Simulate
  ////////////////////////////////
  await simulateContract(wagmiConfig, {
    abi: MerkleClaimAbi.abi as Abi,
    address: merkleClaimContractAddress,
    functionName: 'claim',
    args: [proof, user, assets, totalClaimableForAsset],
    chainId: 1329,
  })

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const txHash = await writeContract(wagmiConfig, {
    abi: MerkleClaimAbi.abi as Abi,
    address: merkleClaimContractAddress,
    functionName: 'claim',
    args: [proof, user, assets, totalClaimableForAsset],
    chainId: 1329,
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

  return txHash
}
