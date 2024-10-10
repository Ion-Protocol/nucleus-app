import { wagmiConfig } from '@/config/wagmi'
import MerkleClaimAbi from '@/contracts/MerkleClaim.json'
import { readContract } from 'wagmi/actions'

export async function getUserClaimedAmountOfAsset(
  { userAddress, assetAddress }: { userAddress: `0x${string}`; assetAddress: `0x${string}` },
  opts: { merkleClaimAddress: `0x${string}`; chainId?: number }
): Promise<bigint> {
  const { merkleClaimAddress, chainId } = opts || { merkleClaimAddress: '', chainId: 1 }
  const claimedAmount = (await readContract(wagmiConfig, {
    abi: MerkleClaimAbi.abi,
    address: merkleClaimAddress,
    functionName: 'usersClaimedAmountOfAsset',
    args: [userAddress, assetAddress],
    chainId: chainId || 1,
  })) as bigint

  return claimedAmount
}
