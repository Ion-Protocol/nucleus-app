import { ChainKey, chainsConfig } from '@/config/chains'
import { wagmiConfig } from '@/config/wagmi'
import ReserveOracle from '@/contracts/ReserveOracle.json'
import { MarketKey } from '@/types/Market'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

/**
 * Retrieves the protocol exchange rate for a given chain and market.
 * @param params - The parameters for retrieving the exchange rate.
 * @param params.chainKey - The key of the chain.
 * @param params.marketKey - The key of the market.
 * @returns - The protocol exchange rate as a BigInt.
 */
export async function getProtocolExchangeRate({ chainKey, marketKey }: { chainKey: ChainKey; marketKey: MarketKey }) {
  const ReserveOracleAddress = chainsConfig[chainKey].markets[marketKey].contracts.reserveOracle

  const exchangeRateAsBigInt = (await readContract(wagmiConfig, {
    abi: ReserveOracle.abi as Abi,
    address: ReserveOracleAddress,
    functionName: 'getProtocolExchangeRate',
    args: [],
  })) as bigint

  return exchangeRateAsBigInt
}
