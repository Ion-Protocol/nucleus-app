import { wagmiConfig } from '@/config/wagmi'
import AccountantWithRateProviders from '@/contracts/AccountantWithRateProviders.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function getRateInQuote(
  { quote }: { quote: `0x${string}` },
  { contractAddress, chainId }: { contractAddress: `0x${string}`; chainId: number }
): Promise<bigint> {
  const rate = await readContract(wagmiConfig, {
    abi: AccountantWithRateProviders.abi as Abi,
    address: contractAddress,
    functionName: 'getRateInQuote',
    args: [quote],
    chainId,
  })

  return rate as bigint
}
