import { contractAddresses } from '@/config/contracts'
import { wagmiConfig } from '@/config/wagmi'
import IonLens from '@/contracts/IonLens.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function liquidity({ ionPool }: { ionPool: `0x${string}` }): Promise<bigint> {
  const contractAddress = contractAddresses.ionLens
  const wethLiquidity = (await readContract(wagmiConfig, {
    abi: IonLens.abi as Abi,
    address: contractAddress,
    functionName: 'liquidity',
    args: [ionPool],
  })) as bigint

  return wethLiquidity
}
