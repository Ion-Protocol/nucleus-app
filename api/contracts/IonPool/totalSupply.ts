import { wagmiConfig } from '@/config/wagmi'
import IonPool from '@/contracts/IonPool.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function totalSupply({ contractAddress }: { contractAddress: `0x${string}` }): Promise<bigint> {
  const totalSupply = (await readContract(wagmiConfig, {
    abi: IonPool.abi as Abi,
    address: contractAddress,
    functionName: 'totalSupply',
    args: [],
  })) as bigint

  return totalSupply
}
