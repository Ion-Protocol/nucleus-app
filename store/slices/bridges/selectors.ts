import { CrossChainTellerBase } from '@/api/contracts/Teller/previewFee'
import { chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/token'
import CrossChainTellerBaseAbi from '@/contracts/CrossChainTellerBase.json'
import { RootState } from '@/store'
import { selectCurrency } from '@/store/slices/currency'
import { Bridge } from '@/types/Bridge'
import { BridgeKey } from '@/types/BridgeKey'
import { TokenKey } from '@/types/TokenKey'
import { WAD } from '@/utils/bigint'
import { currencySwitch } from '@/utils/currency'
import { createSelector } from 'reselect'
import { Abi, erc20Abi } from 'viem'
import { selectAddress } from '../account'
import { selectBalances } from '../balance'
import { selectChainKey } from '../chain'
import { selectUsdPerEthRate } from '../price'
import { selectBridgeKeyFromRoute } from '../router'
import { BridgeData } from './initialState'

export const selectBridgesState = (state: RootState) => state.bridges
export const selectInputError = createSelector([selectBridgesState], (bridgesState) => bridgesState.inputError)
export const selectBridgesLoading = createSelector(
  [selectBridgesState],
  (bridgesState): boolean => bridgesState.overallLoading
)
export const selectSourceBridge = createSelector([selectBridgesState], (bridgesState) => bridgesState.sourceBridge)
export const selectDestinationBridge = createSelector(
  [selectBridgesState],
  (bridgesState) => bridgesState.destinationBridge
)

export const selectTvlLoading = (state: RootState) => state.bridges.tvlLoading
export const selectPreviewFeeLoading = (state: RootState) => state.bridges.previewFeeLoading

export const selectChainConfig = createSelector([selectChainKey], (chainKey) => {
  if (!chainKey) return null
  return chainsConfig[chainKey]
})

export const selectSourceBridgeChainId = createSelector(
  [selectSourceBridge, selectChainConfig],
  (sourceBridgeKey, chainConfig): number | null => {
    if (!sourceBridgeKey) return null
    if (sourceBridgeKey === BridgeKey.ETHEREUM) {
      return 1
    }
    return chainConfig?.bridges[sourceBridgeKey as BridgeKey]?.chainId || null
  }
)

export const selectChainKeyByChainId = (chainId: number | undefined) =>
  Object.keys(chainsConfig).find(
    (bridgeKey) => chainsConfig[bridgeKey as keyof typeof chainsConfig].id === chainId
  ) as BridgeKey | null

export const selectBridgeConfig = createSelector(
  [selectChainConfig, selectBridgeKeyFromRoute],
  (chainConfig, bridgeKey): (Bridge & { key: BridgeKey }) | null => {
    if (!bridgeKey || !chainConfig) return null
    const bridgeConfig = chainConfig.bridges[bridgeKey] as Bridge
    return { ...bridgeConfig, key: bridgeKey }
  }
)

export const selectSourceTokens = createSelector(
  [selectBridgeConfig, selectSourceBridge],
  (bridgeConfig, sourceBridge): TokenKey[] => {
    return bridgeConfig?.sourceTokens[sourceBridge as BridgeKey] || []
  }
)

export const selectTellerAddress = createSelector([selectBridgeConfig], (bridgeConfig): `0x${string}` | null => {
  return bridgeConfig?.contracts.teller || null
})

export const selectBoringVaultAddress = createSelector([selectBridgeConfig], (bridgeConfig): `0x${string}` | null => {
  return bridgeConfig?.contracts.boringVault || null
})

export const selectAccountantAddress = createSelector([selectBridgeConfig], (bridgeConfig): `0x${string}` | null => {
  return bridgeConfig?.contracts.accountant || null
})

export const selectFeeTokenKey = createSelector([selectBridgeConfig], (bridgeConfig): TokenKey | null => {
  return bridgeConfig?.feeToken || null
})

export const selectFeeTokenAddress = createSelector(
  [selectFeeTokenKey, selectSourceBridge],
  (feeTokenKey, sourceBridgeKey): `0x${string}` | null => {
    if (!feeTokenKey || !sourceBridgeKey) return null
    const feeToken = tokensConfig[feeTokenKey as keyof typeof tokensConfig]
    return feeToken.chains[sourceBridgeKey]?.address || null
  }
)

export const selectBridgeConfigByKey = (bridgeKey: BridgeKey) => {
  return createSelector([selectChainConfig], (chainConfig) => {
    if (!chainConfig) return null
    const bridgeConfig = chainConfig.bridges[bridgeKey]
    return { ...bridgeConfig, key: bridgeKey }
  })
}

export const selectBridgesAsArray = createSelector(
  [selectChainConfig],
  (chainConfig): (Bridge & { key: BridgeKey })[] => {
    if (!chainConfig) return []
    return Object.keys(chainConfig.bridges).map((key) => ({
      key: key as BridgeKey,
      ...(chainConfig.bridges[key as BridgeKey] as Bridge),
    }))
  }
)

export const selectSourceBridges = createSelector(
  [selectBridgeConfig, selectChainConfig],
  (bridgeConfig, chainConfig) => {
    if (!bridgeConfig || !chainConfig || !bridgeConfig.sourceBridges) return []
    return bridgeConfig.sourceBridges.map((bridgeKey) => {
      let name = chainConfig.bridges[bridgeKey]?.name
      if (bridgeKey === BridgeKey.ETHEREUM) {
        name = 'Ethereum'
      }
      return { key: bridgeKey, name }
    })
  }
)

export const selectBridgeKeys = createSelector([selectChainConfig], (chainConfig): BridgeKey[] => {
  if (!chainConfig) return []
  return Object.keys(chainConfig.bridges) as BridgeKey[]
})

export const selectAvailableBridgeKeys = createSelector(
  [selectBridgeKeys, selectChainConfig],
  (bridgeKeys, chainConfig): BridgeKey[] => {
    if (!chainConfig) return []
    return bridgeKeys.filter((key) => chainConfig.bridges[key]?.comingSoon === false)
  }
)

export const selectBridgesData = createSelector([selectBridgesState], (bridgesState) => {
  return bridgesState.data
})

export const selectBridgeData = createSelector(
  [selectBridgesData, selectBridgeKeyFromRoute],
  (bridgesData, bridgeKeyFromUrl): BridgeData | null => {
    if (!bridgeKeyFromUrl) return null
    return bridgesData?.[bridgeKeyFromUrl] as BridgeData
  }
)

export const selectBridgeDataFromSourceChain = createSelector(
  [selectBridgesData, selectSourceBridge],
  (bridgesData, bridgeKeyFromSourceChain) => {
    if (!bridgeKeyFromSourceChain) return null
    return bridgesData?.[bridgeKeyFromSourceChain] as BridgeData
  }
)

/**
 * Selects the Total Value Locked (TVL) for a specific bridge key.
 *
 * @param key - The key of the bridge.
 * @returns The TVL for the specified bridge key, or `undefined` if not found.
 */
export const selectBridgeTvlByKey = (bridgeKey: BridgeKey) =>
  createSelector([selectBridgesData], (bridgesData) => {
    const tvl = bridgesData[bridgeKey].tvl.value
    if (!tvl) return BigInt(0)
    return BigInt(tvl)
  })

export const selectActiveBridgeTvl = createSelector(
  [selectBridgesData, selectBridgeKeyFromRoute],
  (bridgesData, bridgeKey) => {
    if (bridgeKey === null) return null
    const tvl = bridgesData[bridgeKey].tvl.value
    if (tvl === null) return null
    return BigInt(tvl)
  }
)

/**
 * Selects the formatted total value locked (TVL) for a specific bridge key.
 *
 * @param key - The bridge key.
 * @returns A selector function that returns the formatted TVL.
 */
export const selectFormattedBridgeTvlByKey = (bridgeKey: BridgeKey) =>
  createSelector(
    [selectBridgeTvlByKey(bridgeKey), selectUsdPerEthRate, selectCurrency, selectChainConfig],
    (tvl, price, currency, chainConfig) => {
      const bridgeConfig = chainConfig?.bridges[bridgeKey]
      const formattedTvl = currencySwitch(currency, tvl, price, { symbol: bridgeConfig?.networkSymbol })
      return formattedTvl || '-'
    }
  )

export const selectActiveFormattedBridgeTvl = createSelector(
  [selectActiveBridgeTvl, selectUsdPerEthRate, selectCurrency, selectBridgeConfig],
  (tvl, price, currency, bridgeConfig) => {
    const formattedTvl = currencySwitch(currency, tvl, price, { symbol: bridgeConfig?.networkSymbol })
    return formattedTvl || '-'
  }
)

export const selectAllBridgeKeys = createSelector([selectChainConfig], (chainConfig): BridgeKey[] => {
  if (!chainConfig) return []
  return Object.keys(chainConfig.bridges) as BridgeKey[]
})

/**
 * Selects the 'from' value of a bridge identified by the given key.
 *
 * @param state - The root state.
 * @param key - The key of the bridge.
 * @returns The 'from' value of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeInputValue = createSelector([selectBridgesState], (bridgesState): string => {
  return bridgesState.inputValue
})

export const selectFromTokenKey = createSelector(
  [selectBridgesState, selectBridgeConfig, selectSourceBridge],
  (bridgesState, bridgeConfig, sourceBridge): TokenKey | null => {
    if (!bridgeConfig) return null
    return bridgesState.selectedFromToken || bridgeConfig?.sourceTokens[sourceBridge as BridgeKey]?.[0] || null
  }
)

/**
 * Selects the deposit amount as a BigInt.
 *
 * @param selectBridgeFrom - The selector function to get the bridge from.
 * @param depositAmountAsString - The deposit amount as a string.
 * @returns The deposit amount as a BigInt.
 */
export const selectDepositAmountAsBigInt = createSelector([selectBridgeInputValue], (depositAmountAsString): bigint => {
  if (!depositAmountAsString || depositAmountAsString.trim() === '') return BigInt(0)
  return BigInt(parseFloat(depositAmountAsString) * WAD.number)
})

/**
 * Retrieves the rate of a specific bridge from the state.
 *
 * @param state - The root state of the application.
 * @param key - The key of the bridge.
 * @returns The rate of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeRate = createSelector([selectBridgeData], (bridgeData): string | number | null => {
  if (!bridgeData) return null
  return bridgeData.rate.value
})

export const selectDepositPending = createSelector([(state: RootState) => state], (state) => {
  const bridges = selectBridgesState(state)
  return bridges.deposit.pending
})

export const selectDepositError = createSelector([(state: RootState) => state], (state) => {
  const bridges = selectBridgesState(state)
  return bridges.deposit.error
})

export const selectPreviewFee = (state: RootState): string | null => state.bridges.previewFee
export const selectPreviewFeeAsBigInt = createSelector([selectPreviewFee], (previewFee): bigint => {
  return previewFee ? BigInt(previewFee) : BigInt(0)
})

export const selectFormattedPreviewFee = createSelector(
  [selectPreviewFeeAsBigInt, selectUsdPerEthRate, selectCurrency, selectBridgeConfig],
  (previewFee, price, currency, bridgeConfig): string => {
    if (!previewFee) {
      price = BigInt(0)
    }
    const formattedPreviewFee = currencySwitch(currency, previewFee, price, {
      usdDigits: 2,
      ethDigits: 7,
      symbol: bridgeConfig?.networkSymbol,
    })
    return formattedPreviewFee
  }
)

export const selectDepositDisabled = createSelector(
  [selectBridgeInputValue, selectInputError, selectDepositPending, selectPreviewFeeLoading],
  (from, error, pending, previewFeeLoading): boolean => {
    return !from.trim() || parseFloat(from) === 0 || !!error || !!pending
  }
)

export const selectReceiveOnBridge = createSelector(
  [selectBridgeConfig, selectChainConfig],
  (bridgeConfig, chainConfig) => {
    if (!bridgeConfig || !chainConfig) return null
    const receiveOn = bridgeConfig.receiveOn
    if (receiveOn === BridgeKey.ETHEREUM) return 'Ethereum'
    return chainConfig.bridges[receiveOn]?.name || null
  }
)

export const selectDepositAssetAddress = createSelector(
  [selectFromTokenKey, selectSourceBridge],
  (depositAssetTokenKey, sourceBridgeKey) => {
    if (!depositAssetTokenKey || !sourceBridgeKey) return null
    return tokensConfig[depositAssetTokenKey]?.chains[sourceBridgeKey as BridgeKey]?.address
  }
)

export const selectContractAddressByName = (name: string) =>
  createSelector([selectBridgeConfig], (bridgeConfig) => {
    return bridgeConfig?.contracts[name as keyof typeof bridgeConfig.contracts]
  })

export const selectSelectedTokenBalance = createSelector(
  [selectSourceBridge, selectFromTokenKey, selectBalances],
  (sourceBridgeKey, fromTokenKey, balances) => {
    if (!sourceBridgeKey || !fromTokenKey) return null
    return balances[fromTokenKey]?.[sourceBridgeKey] || null
  }
)

export const selectWalletHasEnoughBalance = createSelector(
  [selectSelectedTokenBalance, selectDepositAmountAsBigInt],
  (selectedTokenBalance, depositAmountAsBigInt) => {
    if (selectedTokenBalance === null) return false
    return BigInt(selectedTokenBalance) >= depositAmountAsBigInt
  }
)

export const selectShouldUseFunCheckout = createSelector([selectWalletHasEnoughBalance], (walletHasEnoughBalance) => {
  return !walletHasEnoughBalance
})

export const selectLayerZeroChainSelector = createSelector([selectBridgeConfig], (bridgeConfig): number => {
  return bridgeConfig?.layerZeroChainSelector || 0
})

export const selectDepositBridgeData = createSelector(
  [selectLayerZeroChainSelector, selectAddress, selectFeeTokenAddress],
  (layerZeroChainSelector, userAddress, feeTokenAddress): CrossChainTellerBase.BridgeData | null => {
    if (!userAddress || !feeTokenAddress) return null
    return {
      chainSelector: layerZeroChainSelector,
      destinationChainReceiver: userAddress,
      bridgeFeeToken: feeTokenAddress,
      messageGas: 100000,
      data: '',
    }
  }
)

export const selectDepositAndBridgeCheckoutParams = (minimumMint: bigint) =>
  createSelector(
    [
      selectFromTokenKey,
      selectBridgeConfig,
      selectDepositAssetAddress,
      selectDepositAmountAsBigInt,
      selectAddress,
      selectFeeTokenAddress,
      selectPreviewFeeAsBigInt,
      selectBridgeInputValue,
      selectContractAddressByName('boringVault'),
      selectContractAddressByName('teller'),
      selectDepositBridgeData,
    ],
    (
      depositAssetTokenKey,
      bridgeConfig,
      depositAssetAddress,
      depositAmount,
      userAddress,
      feeTokenAddress,
      feeAsBigInt,
      fromAmount,
      boringVaultAddress,
      tellerContractAddress,
      depositBridgeData
    ) => {
      // Constants
      const VERB = 'Mint'

      // Values
      const fromTokenInfo = depositAssetTokenKey ? tokensConfig[depositAssetTokenKey] : null
      const layerZeroChainSelector = bridgeConfig?.layerZeroChainSelector

      // Null checks
      if (!userAddress || !feeTokenAddress || !feeAsBigInt || !depositAssetAddress) {
        return null
      }

      // Derived Values
      const paddedFee = (feeAsBigInt * BigInt(101)) / BigInt(100)

      // Build the checkout params
      return {
        modalTitle: `${VERB} ${fromTokenInfo?.name}`,
        iconSrc: `/assets/svgs/token-${fromTokenInfo?.key}.svg`,
        actionsParams: [
          // Approve the ERC20 token
          {
            contractAbi: erc20Abi,
            contractAddress: depositAssetAddress,
            functionName: 'approve',
            functionArgs: [boringVaultAddress, depositAmount],
          },
          // Deposit the token
          {
            contractAbi: CrossChainTellerBaseAbi.abi as Abi,
            contractAddress: tellerContractAddress,
            functionName: 'depositAndBridge',
            functionArgs: [depositAssetAddress, depositAmount, minimumMint, depositBridgeData],
            value: paddedFee,
          },
        ],
        targetChain: '1',
        targetAsset: depositAssetAddress,
        targetAssetAmount: parseFloat(fromAmount),
        checkoutItemTitle: `Bridge ${fromTokenInfo?.name}`,
        checkoutItemDescription: `${VERB} ${fromTokenInfo?.name}`,
        checkoutItemAmount: parseFloat(fromAmount),
        expirationTimestampMs: 3600000,
        disableEditing: true,
      }
    }
  )
