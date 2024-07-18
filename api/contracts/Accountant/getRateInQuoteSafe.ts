import { wagmiConfig } from '@/config/wagmi'
import AccountantWithRateProviders from '@/contracts/AccountantWithRateProviders.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function getRateInQuoteSafe(
  { quote }: { quote: `0x${string}` },
  { contractAddress }: { contractAddress: `0x${string}` }
): Promise<bigint> {
  const rate = await readContract(wagmiConfig, {
    abi: AccountantWithRateProviders.abi as Abi,
    address: contractAddress,
    functionName: 'getRateInQuoteSafe',
    args: [quote],
  })

  return rate as bigint
}
