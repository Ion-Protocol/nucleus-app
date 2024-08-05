import { readContract } from 'wagmi/actions'
import BoringVault from '@/contracts/BoringVault.json'
import { wagmiConfig } from '@/config/wagmi'

export async function getTotalSupply(vaultAddress: `0x${string}`): Promise<bigint> {
  const totalSupply = (await readContract(wagmiConfig, {
    abi: BoringVault.abi,
    address: vaultAddress,
    functionName: 'totalSupply',
  })) as bigint

  return totalSupply
}
