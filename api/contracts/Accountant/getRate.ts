import { wagmiConfig } from '@/config/wagmi'
import AccountantWithRateProviders from '@/contracts/AccountantWithRateProviders.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function getRate(contractAddress: `0x${string}`, opts: { chainId: number }): Promise<bigint> {
  const rate = await readContract(wagmiConfig, {
    abi: AccountantWithRateProviders.abi as Abi,
    address: contractAddress,
    functionName: 'getRate',
    args: [],
    chainId: opts.chainId,
  })

  return rate as bigint
}
