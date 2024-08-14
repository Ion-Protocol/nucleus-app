import { balanceOf } from '@/api/contracts/erc20/balanceOf'
import { BridgeKey } from '@/types/BridgeKey'
import { tokensConfig } from '@/config/token'
import { TokenKey } from '@/types/TokenKey'
import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getBalance } from 'wagmi/actions'
import { selectAddress } from '../account'
import { setErrorMessage } from '../status'

type Balances = Record<TokenKey, Record<BridgeKey, string | null>>
export interface fetchAllTokenBalancesResult {
  balances: Balances
}

/**
 * Async thunk to fetch the balances of all tokens for the current user's address.
 *
 * This function retrieves the user's address from the state, and then concurrently fetches the
 * balance for each token defined in the tokensConfig. If successful, it returns an object
 * containing all token balances. If an error occurs, it logs the error, dispatches it to the error
 * slice, and rejects the thunk with an error message.
 *
 * @returns {Promise<fetchAllTokenBalancesResult>} - An object containing the balances of all tokens.
 *
 * @throws {string} - An error message indicating the failure to fetch token balances.
 */
export const fetchAllTokenBalances = createAsyncThunk<
  fetchAllTokenBalancesResult,
  void,
  { rejectValue: string; state: RootState }
>('balances/fetchAllTokenBalances', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()

  const address = selectAddress(state)

  const balances: Balances = {} as Balances

  if (!address) {
    return rejectWithValue('No address found in state.')
  }

  // Create token balance param items as an empty array
  // Each object in this array is used as params for the balanceOf function
  let tokenBalanceParamItems: {
    chainKey: BridgeKey
    chainId: number
    tokenKey: TokenKey
    tokenAddress: `0x${string}`
  }[] = []

  // Iterate over each token in the tokensConfig and create token balance param items
  for (const tokenKey in tokensConfig) {
    const tokenConfig = tokensConfig[tokenKey as TokenKey]
    const chainKeys = Object.keys(tokenConfig.chains)
    for (const chainKey of chainKeys) {
      const chainConfig = tokenConfig.chains[chainKey as keyof typeof tokenConfig.chains]
      if (chainConfig?.chainId && chainConfig?.address && chainConfig?.address !== '0x') {
        tokenBalanceParamItems.push({
          chainKey: chainKey as BridgeKey,
          chainId: chainConfig?.chainId,
          tokenKey: tokenKey as TokenKey,
          tokenAddress: chainConfig?.address,
        })
      }
    }
  }

  // Fetch the balances for each token using the token balance param items
  try {
    const balancePromises = tokenBalanceParamItems.map(async (tokenBalanceParamItem) => {
      const { chainKey, chainId, tokenKey, tokenAddress } = tokenBalanceParamItem

      if (tokenKey === TokenKey.ETH) {
        const { value: balance } = await getBalance(wagmiConfig, { address })
        return { tokenKey: tokenKey as TokenKey, bridgeKey: chainKey, balance: balance.toString() }
      } else if (tokenAddress && chainId) {
        const balance = await balanceOf({ balanceAddress: address, tokenAddress, chainId })
        return { tokenKey: tokenKey as TokenKey, bridgeKey: chainKey, balance: balance.toString() }
      }
    })

    const results = await Promise.all(balancePromises)

    for (const result of results) {
      if (result && result.tokenKey && result.bridgeKey) {
        if (!balances[result.tokenKey as TokenKey]) {
          balances[result.tokenKey as TokenKey] = {} as Record<BridgeKey, string | null>
        }
        balances[result.tokenKey as TokenKey][result.bridgeKey as BridgeKey] = result.balance
      }
    }

    return { balances }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch token balance for address ${address}.`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})

export interface fetchEthBalanceResult {
  balance: string
}

export const fetchEthBalance = createAsyncThunk<fetchEthBalanceResult, void, { rejectValue: string; state: RootState }>(
  'balances/fetchEthBalance',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState()

    const address = selectAddress(state)

    if (!address) {
      return rejectWithValue('No address found in state.')
    }

    try {
      const { value: balance } = await getBalance(wagmiConfig, { address })
      return { balance: balance.toString() }
    } catch (e) {
      const error = e as Error
      const errorMessage = `Failed to fetch ETH balance for address ${address}.`
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      console.error(fullErrorMessage)
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

export interface fetchMultiChainTokenBalancesResult {
  balances: Record<BridgeKey, Record<TokenKey, string | null>>
}

export const fetchMultiChainTokenBalances = createAsyncThunk<
  fetchMultiChainTokenBalancesResult,
  void,
  { rejectValue: string; state: RootState }
>('balances/fetchMultiChainTokenBalances', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()

  const address = selectAddress(state)
  const balances: Record<BridgeKey, Record<TokenKey, string | null>> = {} as Record<
    BridgeKey,
    Record<TokenKey, string | null>
  >

  if (!address) {
    return rejectWithValue('No address found in state.')
  }

  try {
    const { value: balance } = await getBalance(wagmiConfig, { address })
    return { balances }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch ETH balance for address ${address}.`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
