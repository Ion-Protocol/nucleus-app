import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { wagmiConfig } from '@/config/wagmi'
import AccountantWithRateProviders from '@/contracts/AccountantWithRateProviders.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export async function getRateInQuote(
  { quote }: { quote: `0x${string}` },
  { bridgeKey }: { bridgeKey: BridgeKey }
): Promise<bigint> {
  const contractAddress = bridgesConfig[bridgeKey].contracts.accountant
  const rate = await readContract(wagmiConfig, {
    abi: AccountantWithRateProviders.abi as Abi,
    address: contractAddress,
    functionName: 'getRateInQuote',
    args: [quote],
  })

  return rate as bigint
}
