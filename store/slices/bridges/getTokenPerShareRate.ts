import { getRate } from '@/api/contracts/Accountant/getRate'
import { latestRoundData } from '@/api/contracts/Chainlink/latestRoundData'
import { contractAddresses } from '@/config/contracts'
import { BridgeKey } from '@/types/BridgeKey'
import { Address } from 'viem'

interface RateFetchingStrategy {
  getRate(accountantAddress: Address): Promise<bigint>
}

class RateForSei implements RateFetchingStrategy {
  async getRate(accountantAddress: Address): Promise<bigint> {
    return getRate(accountantAddress)
  }
}

class RateForFrax implements RateFetchingStrategy {
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
    throw new Error('Exchange rate for this bridge is not yet implemented')
  }
}

/**
 * Fetches the token per share rate for a given bridge key and accountant address.
 *
 * This function maps bridge keys to their respective rate fetching strategies and returns
 * the corresponding rate for the specified bridge.
 *
 * @param bridgeKey - The key of the bridge for which the rate is being fetched.
 * @param accountantAddress - The address of the accountant contract used to fetch the rate.
 * @returns A promise that resolves to the token per share rate as a bigint.
 */
export async function getTokenPerShareRate(bridgeKey: BridgeKey, accountantAddress: Address): Promise<bigint> {
  const strategies: Record<BridgeKey, RateFetchingStrategy> = {
    [BridgeKey.ETHEREUM]: new NotImplementedStrategy(),
    [BridgeKey.FRAX]: new RateForFrax(),
    [BridgeKey.MORPH]: new NotImplementedStrategy(),
    [BridgeKey.OPTIMISM_SEPOLIA_LAYER_ZERO]: new NotImplementedStrategy(),
    [BridgeKey.OPTIMISM_SEPOLIA_OPSTACK]: new NotImplementedStrategy(),
    [BridgeKey.SEI]: new RateForSei(),
    [BridgeKey.SWELL]: new RateForSwell(),
  }

  return await strategies[bridgeKey].getRate(accountantAddress)
}
