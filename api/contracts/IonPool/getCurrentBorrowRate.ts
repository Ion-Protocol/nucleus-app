import { wagmiConfig } from '@/config/wagmi'
import IonPool from '@/contracts/IonPool.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function getCurrentBorrowRate(
  { ilkIndex }: { ilkIndex: number },
  { contractAddress }: { contractAddress: `0x${string}` }
): Promise<bigint> {
  const currentBorrowRate = (await readContract(wagmiConfig, {
    abi: IonPool.abi as Abi,
    address: contractAddress,
    functionName: 'getCurrentBorrowRate',
    args: [ilkIndex],
  })) as [bigint, bigint]

  return currentBorrowRate[0]
}
