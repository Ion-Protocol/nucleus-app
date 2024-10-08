import { readContract } from 'wagmi/actions'
import BoringVault from '@/contracts/BoringVault.json'
import { wagmiConfig } from '@/config/wagmi'
import { sei } from 'viem/chains'

export async function getTotalSupply(vaultAddress: `0x${string}`, opts?: { chainId: number }): Promise<bigint> {
  const totalSupply = (await readContract(wagmiConfig, {
    abi: BoringVault.abi,
    address: vaultAddress,
    functionName: 'totalSupply',
    chainId: opts?.chainId,
  })) as bigint

  return totalSupply
}
