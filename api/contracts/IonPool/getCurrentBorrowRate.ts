import { ChainKey, chainsConfig } from '@/config/chains'
import { wagmiConfig } from '@/config/wagmi'
import IonPool from '@/contracts/IonPool.json'
import { MarketKey } from '@/types/Market'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function getCurrentBorrowRate({
  ilkIndex,
  chainKey,
  marketKey,
}: {
  ilkIndex: number
  chainKey: ChainKey
  marketKey: MarketKey
}): Promise<bigint> {
  const contractAddress = chainsConfig[chainKey].markets[marketKey].contracts.ionPool
  const currentBorrowRate = (await readContract(wagmiConfig, {
    abi: IonPool.abi as Abi,
    address: contractAddress,
    functionName: 'getCurrentBorrowRate',
    args: [ilkIndex],
  })) as [bigint, bigint]

  return currentBorrowRate[0]
}
