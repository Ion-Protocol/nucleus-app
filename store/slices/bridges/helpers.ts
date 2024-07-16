import { balanceOf } from '@/api/contracts/erc20/balanceOf'
import { ChainKey, chainsConfig } from '@/config/chains'
import { TokenKey, tokensConfig } from '@/config/token'
import { MarketKey } from '@/types/Market'
import { WAD } from '@/utils/bigint'

/**
 * Retrieves the pool addresses for a specific lender asset on a given chain.
 * @param chainKey - The key of the chain.
 * @param lenderAssetKey - The key of the lender asset.
 * @returns An array of pool addresses as strings.
 */
export function getPoolsForLenderAsset(chainKey: ChainKey, lenderAssetKey: TokenKey): `0x${string}`[] {
  const marketsForChain = chainsConfig[chainKey].markets

  const ionPoolAddresses: `0x${string}`[] = []

  for (const marketKey in marketsForChain) {
    const market = marketsForChain[marketKey as MarketKey]

    if (market.lenderAsset === lenderAssetKey) {
      ionPoolAddresses.push(market.contracts.ionPool)
    }
  }

  return ionPoolAddresses
}

/**
 * Fetches and calculates the total asset balance with pools.
 *
 * @param tokenKey - The token key.
 * @param chainKey - The chain key.
 * @param vaultAddress - The vault address.
 * @returns The total balance.
 */
export async function getTotalAssetBalanceWithPools({
  tokenKey,
  chainKey,
  vaultAddress,
}: {
  tokenKey: TokenKey
  chainKey: ChainKey
  vaultAddress: `0x${string}`
}) {
  // Setup: Get the token address from the token key
  const tokenAddress = tokensConfig[tokenKey].address

  // Step 1: Get all pool addresses where the lender asset is the token key
  const poolAddresses = getPoolsForLenderAsset(chainKey, tokenKey)

  // Step 2: Fetch the balance of the token
  const tokenBalancePromise = balanceOf({ tokenAddress, balanceAddress: vaultAddress })

  // Step 3: Fetch the balances of each pool where the lender asset is the token key
  const poolBalancePromises = poolAddresses.map((pool) =>
    balanceOf({ tokenAddress: pool, balanceAddress: vaultAddress })
  )

  // Step 4: Await the promises in parellel
  const [tokenBalance, ...poolBalances] = await Promise.all([tokenBalancePromise, ...poolBalancePromises])

  // Step 5: Sum the total balance
  const totalBalance = poolBalances.reduce((acc, poolBalance) => acc + poolBalance, tokenBalance)

  return totalBalance
}

/**
 * Calculates the Total Value Locked (TVL) in ETH based on the given token balances and exchange rates.
 *
 * Example:
 *   balance = 1 wstETH
 *   price = 1.17 ETH/wstETH
 *   1 wstETH * 1.17 ETH/wstETH = 1.17 ETH
 *
 * @param tokenBalances - An array of token balances with the native token unit. E.g. 1 wstETH
 * @param tokenExchangeRates - An array of token exchange rates as ETH/nativeToken. E.g. 1.17 ETH/wstETH
 * @returns The TVL in ETH as a bigint.
 */
export function calculateTvl(tokenBalances: bigint[], tokenExchangeRates: bigint[]): bigint {
  const tvlInEth = tokenBalances.reduce((acc, balance, index) => {
    const exchangeRate = tokenExchangeRates[index]
    return acc + (balance * exchangeRate) / WAD.bigint
  }, BigInt(0))

  return tvlInEth
}
