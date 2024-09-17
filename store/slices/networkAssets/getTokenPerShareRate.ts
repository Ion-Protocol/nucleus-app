import { getRate } from '@/api/contracts/Accountant/getRate'
import { latestRoundData } from '@/api/contracts/Chainlink/latestRoundData'
import { contractAddresses } from '@/config/contracts'
import { TokenKey } from '@/types/TokenKey'
import { Address } from 'viem'

interface RateFetchingStrategy {
  getRate(accountantAddress: Address): Promise<bigint>
}

class RateForSseth implements RateFetchingStrategy {
  async getRate(accountantAddress: Address): Promise<bigint> {
    return getRate(accountantAddress)
  }
}

class RateForSwell implements RateFetchingStrategy {
  async getRate(accountantAddress: Address): Promise<bigint> {
    const wbtcPerShareExchangeRate = await getRate(accountantAddress) // 1e9
    const { answer: btcPerWbtcExchangeRate } = await latestRoundData(contractAddresses.chainlinkBtcPerWbtc) // 1e9

    // Convert WBTC/share to BTC/share
    return wbtcPerShareExchangeRate * btcPerWbtcExchangeRate // 1e18
  }
}

class NotImplementedStrategy implements RateFetchingStrategy {
  async getRate(accountantAddress: Address): Promise<bigint> {
    throw new Error('Exchange rate for this chain is not yet implemented')
  }
}

/**
 * Fetches the token per share rate for a given network asset key and accountant address.
 *
 * This function maps network asset keys to their respective rate fetching strategies and returns
 * the corresponding rate for the specified network asset.
 *
 * @param networkAssetKey - The key of the network asset for which the rate is being fetched.
 * @param accountantAddress - The address of the accountant contract used to fetch the rate.
 * @returns A promise that resolves to the token per share rate as a bigint.
 */
export async function getTokenPerShareRate(networkAssetKey: TokenKey, accountantAddress: Address): Promise<bigint> {
  const rateStrategies: Partial<Record<TokenKey, RateFetchingStrategy>> = {
    [TokenKey.SSETH]: new RateForSseth(),
  }

  const rateStrategy = rateStrategies[networkAssetKey] || new NotImplementedStrategy()
  return rateStrategy.getRate(accountantAddress)
}
