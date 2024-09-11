import { CrossChainTellerBase } from '@/api/contracts/Teller/previewFee'
import { RewardsAndPointsRow } from '@/components/Bridge/BridgeTitle/RewardsAndPoints/RewardsAndPointsTooltip'
import { networksConfig } from '@/config/networks'
import { tokensConfig } from '@/config/token'
import CrossChainTellerBaseAbi from '@/contracts/CrossChainTellerBase.json'
import { RootState } from '@/store'
import { Chain } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumber, WAD } from '@/utils/bigint'
import { currencySwitch } from '@/utils/currency'
import { createSelector } from 'reselect'
import { Abi, erc20Abi } from 'viem'
import { selectAddress } from '../account'
import { selectBalances } from '../balance'
import { selectNetworkKey } from '../chain'
import { selectUsdPerEthRate } from '../price'
import { selectChainKeyFromRoute } from '../router'
import { ChainData } from './initialState'

const USE_FUNKIT = process.env.NEXT_PUBLIC_USE_FUNKIT === 'true'

/////////////////////////////////////////////////////////////////////
// Principal Selectors: Influences the result of many other selectors
/////////////////////////////////////////////////////////////////////
export const selectBridgesState = (state: RootState) => state.bridges
export const selectSourceChainKey = createSelector([selectBridgesState], (bridgesState) => bridgesState.sourceChain)

// Bridges State Selectors
export const selectBridgesData = createSelector([selectBridgesState], (bridgesState) => {
  return bridgesState.data
})
export const selectChainData = createSelector(
  [selectBridgesData, selectChainKeyFromRoute],
  (bridgesData, chainKeyFromUrl): ChainData | null => {
    if (!chainKeyFromUrl) return null
    return bridgesData?.[chainKeyFromUrl] as ChainData
  }
)

/////////////////////////////////////////////////////////////////////
// Config Selectors
/////////////////////////////////////////////////////////////////////
export const selectNetworkConfig = createSelector([selectNetworkKey], (networkKey) => {
  if (!networkKey) return null
  return networksConfig[networkKey]
})
export const selectChainConfig = createSelector(
  [selectNetworkConfig, selectChainKeyFromRoute],
  (networkConfig, chainKey): (Chain & { key: ChainKey }) | null => {
    if (!chainKey || !networkConfig) return null
    const chainConfig = networkConfig.chains[chainKey] as Chain
    return { ...chainConfig, key: chainKey }
  }
)
export const selectChainConfigByKey = (chainKey: ChainKey) => {
  return createSelector([selectNetworkConfig], (networkConfig) => {
    if (!networkConfig) return null
    const chainConfig = networkConfig.chains[chainKey]
    return { ...chainConfig, key: chainKey }
  })
}

export const selectAllChainKeys = createSelector([selectNetworkConfig], (chainConfig): ChainKey[] => {
  if (!chainConfig) return []
  return Object.keys(chainConfig.chains) as ChainKey[]
})
export const selectAvailableChainKeys = createSelector(
  [selectAllChainKeys, selectNetworkConfig],
  (chainKeys, chainConfig): ChainKey[] => {
    if (!chainConfig) return []
    return chainKeys.filter((key) => chainConfig.chains[key]?.comingSoon === false)
  }
)

export const selectContractAddressByName = (name: string) =>
  createSelector([selectChainConfig], (chainConfig) => {
    return chainConfig?.contracts[name as keyof typeof chainConfig.contracts]
  })
export const selectLayerZeroChainSelector = createSelector([selectChainConfig], (chainConfig): number => {
  return chainConfig?.layerZeroChainSelector || 0
})
export const selectFeeTokenKey = createSelector([selectChainConfig], (chainConfig): TokenKey | null => {
  return chainConfig?.feeToken || null
})
export const selectFeeTokenAddress = createSelector(
  [selectFeeTokenKey, selectSourceChainKey],
  (feeTokenKey, sourceChainKey): `0x${string}` | null => {
    if (!feeTokenKey || !sourceChainKey) return null
    const feeToken = tokensConfig[feeTokenKey as keyof typeof tokensConfig]
    return feeToken.chains[sourceChainKey]?.address || null
  }
)
export const selectReceiveOnChain = createSelector([selectChainConfig, selectNetworkConfig], (chainConfig) => {
  if (!chainConfig) return null
  return chainConfig.receiveOn
})

export const selectChainNameByChainKey = (chainKey: ChainKey) =>
  createSelector([selectNetworkConfig], (networkConfig) => {
    if (!networkConfig) return null
    if (chainKey === ChainKey.ETHEREUM) return 'Ethereum'
    const chain = networkConfig.chains[chainKey]
    return chain?.name || null
  })

export const selectYieldAssetByChainKey = (chainKey: ChainKey) =>
  createSelector([selectNetworkConfig], (networkConfig): TokenKey | null => {
    const chain = networkConfig?.chains[chainKey]
    return chain?.yieldAsset || null
  })

export const selectYieldAssetNameByChainKey = (chainKey: ChainKey) =>
  createSelector([selectYieldAssetByChainKey(chainKey)], (yieldAsset) => {
    if (!yieldAsset) return null
    return tokensConfig[yieldAsset].name
  })

/////////////////////////////////////////////////////////////////////
// Nav Drawer
/////////////////////////////////////////////////////////////////////
export const selectChainsAsArray = createSelector(
  [selectNetworkConfig],
  (chainConfig): (Chain & { key: ChainKey })[] => {
    if (!chainConfig) return []
    return Object.keys(chainConfig.chains).map((key) => ({
      key: key as ChainKey,
      ...(chainConfig.chains[key as ChainKey] as Chain),
    }))
  }
)

/////////////////////////////////////////////////////////////////////
// TVL
/////////////////////////////////////////////////////////////////////
export const selectTvlLoading = (state: RootState) => state.bridges.tvlLoading
export const selectChainTvlByKey = (chainKey: ChainKey) =>
  createSelector([selectBridgesData], (bridgesData) => {
    const tvl = bridgesData[chainKey].tvl.value
    if (!tvl) return BigInt(0)
    return BigInt(tvl)
  })
export const selectActiveChainTvl = createSelector(
  [selectBridgesData, selectChainKeyFromRoute],
  (bridgesData, chainKey) => {
    if (chainKey === null) return null
    const tvl = bridgesData[chainKey].tvl.value
    if (tvl === null) return null
    return BigInt(tvl)
  }
)
export const selectFormattedChainTvlByKey = (chainKey: ChainKey) =>
  createSelector(
    [selectChainTvlByKey(chainKey), selectUsdPerEthRate, selectNetworkConfig],
    (tvl, price, networkConfig) => {
      const chainConfig = networkConfig?.chains[chainKey]
      const formattedTvl = currencySwitch(tvl, price)
      return formattedTvl || '-'
    }
  )
export const selectActiveFormattedChainTvl = createSelector(
  [selectActiveChainTvl, selectUsdPerEthRate, selectChainConfig],
  (tvl, price, chainConfig) => {
    const formattedTvl = currencySwitch(tvl, price)
    return formattedTvl || '-'
  }
)

/////////////////////////////////////////////////////////////////////
// Rewards & Points
/////////////////////////////////////////////////////////////////////
export const selectIncentiveSystemsForBridge = (chainKey: ChainKey) =>
  createSelector([selectNetworkConfig], (networkConfig) => {
    const chainConfig = networkConfig?.chains[chainKey]
    return chainConfig?.incentives || []
  })
export const selectPointsSystemsForBridge = (chainKey: ChainKey) =>
  createSelector([selectChainConfig], (chainConfig) => {
    return chainConfig?.points || []
  })
export const selectIncentiveChainKeysForBridge = (chainKey: ChainKey) =>
  createSelector([selectIncentiveSystemsForBridge(chainKey)], (incentiveSystems) => {
    return incentiveSystems.map((incentiveSystem) => incentiveSystem.chainKey)
  })
export const selectRewardsAndPointsRows = (chainKey: ChainKey) =>
  createSelector(
    [selectIncentiveSystemsForBridge(chainKey), selectPointsSystemsForBridge(chainKey)],
    (incentiveSystems, pointSystems) => {
      const rows: RewardsAndPointsRow[] = []
      for (let i = 0; i < incentiveSystems.length; i++) {
        const incentiveSystem = incentiveSystems[i]
        const pointSystem = pointSystems[i]
        rows.push({
          rewards: incentiveSystem
            ? { chainKey: incentiveSystem.chainKey, rewardPercentage: incentiveSystem.rewardPercentage }
            : null,
          points: pointSystem
            ? { pointSystemKey: pointSystem.pointSystemKey, multiplier: pointSystem.multiplier }
            : null,
        })
      }
      return rows
    }
  )

/////////////////////////////////////////////////////////////////////
// Chain dropdown menu
/////////////////////////////////////////////////////////////////////
export const selectSourceChains = createSelector(
  [selectChainConfig, selectNetworkConfig],
  (chainConfig, networkCOnfig) => {
    if (!chainConfig || !networkCOnfig || !chainConfig.sourceChains) return []
    return chainConfig.sourceChains.map((chainKey) => {
      let name = networkCOnfig.chains[chainKey]?.name
      if (chainKey === ChainKey.ETHEREUM) {
        name = 'Ethereum'
      }
      return { key: chainKey, name }
    })
  }
)
export const selectSourceChainId = createSelector(
  [selectSourceChainKey, selectNetworkConfig],
  (sourceChainKey, chainConfig): number | null => {
    if (!sourceChainKey) return null
    if (sourceChainKey === ChainKey.ETHEREUM) {
      return 1
    }
    return chainConfig?.chains[sourceChainKey as ChainKey]?.chainId || null
  }
)

// Token dropdown menu
export const selectSourceTokens = createSelector(
  [selectChainConfig, selectSourceChainKey],
  (chainConfig, sourceChain): TokenKey[] => {
    return chainConfig?.sourceTokens[sourceChain as ChainKey] || []
  }
)
export const selectSourceTokenKey = createSelector(
  [selectBridgesState, selectChainConfig, selectSourceChainKey],
  (bridgesState, chainConfig, sourceChainKey): TokenKey | null => {
    if (!chainConfig) return null
    return bridgesState.selectedSourceToken || chainConfig?.sourceTokens[sourceChainKey as ChainKey]?.[0] || null
  }
)
export const selectDepositAssetAddress = createSelector(
  [selectSourceTokenKey, selectSourceChainKey],
  (depositAssetTokenKey, sourceChainKey) => {
    if (!depositAssetTokenKey || !sourceChainKey) return null
    return tokensConfig[depositAssetTokenKey]?.chains[sourceChainKey as ChainKey]?.address
  }
)

/////////////////////////////////////////////////////////////////////
// Deposit amount input
/////////////////////////////////////////////////////////////////////
export const selectDepositAmount = createSelector([selectBridgesState], (bridgesState): string => {
  return bridgesState.depositAmount
})
export const selectDepositAmountAsBigInt = createSelector([selectDepositAmount], (depositAmountAsString): bigint => {
  if (!depositAmountAsString || depositAmountAsString.trim() === '') return BigInt(0)
  return BigInt(parseFloat(depositAmountAsString) * WAD.number)
})

export const selectShouldIgnoreBalance = createSelector([selectSourceChainKey], (sourceChainKey) => {
  const isFunkitEnabled = USE_FUNKIT
  const isSourceChainEthereum = sourceChainKey === ChainKey.ETHEREUM
  return isFunkitEnabled && isSourceChainEthereum
})

export const selectInputError = createSelector(
  [
    selectDepositAmount,
    selectSourceChainKey,
    selectChainKeyFromRoute,
    selectSourceTokenKey,
    selectBalances,
    selectShouldIgnoreBalance,
  ],
  (inputValue, chainKeyFromChainSelector, chainKeyFromRoute, selectedTokenKey, balances, shouldIgnoreBalance) => {
    if (shouldIgnoreBalance) return null
    if (!selectedTokenKey) return null
    const tokenBalance = balances[selectedTokenKey]?.[chainKeyFromChainSelector]
    if (!tokenBalance) return null
    const tokenBalanceAsNumber = parseFloat(bigIntToNumber(BigInt(tokenBalance)))
    if (tokenBalanceAsNumber === null) return null

    if (parseFloat(inputValue) > tokenBalanceAsNumber) {
      return 'Insufficient balance'
    } else {
      return null
    }
  }
)

/////////////////////////////////////////////////////////////////////
// Bridge Rate
// Used to calculate the destination amount based on the deposit amount
/////////////////////////////////////////////////////////////////////
export const selectBridgeRate = createSelector([selectChainData], (bridgeData): string | number | null => {
  if (!bridgeData) return null
  return bridgeData.rate.value
})

/////////////////////////////////////////////////////////////////////
// Balance
/////////////////////////////////////////////////////////////////////
export const selectSelectedTokenBalance = createSelector(
  [selectSourceChainKey, selectSourceTokenKey, selectBalances],
  (sourceChainKey, fromTokenKey, balances) => {
    if (!sourceChainKey || !fromTokenKey) return null
    return balances[fromTokenKey]?.[sourceChainKey] || null
  }
)

export const selectWalletHasEnoughBalance = createSelector(
  [selectSelectedTokenBalance, selectDepositAmountAsBigInt],
  (selectedTokenBalance, depositAmountAsBigInt) => {
    if (selectedTokenBalance === null) return false
    return BigInt(selectedTokenBalance) >= depositAmountAsBigInt
  }
)

/////////////////////////////////////////////////////////////////////
// Preview Fee
/////////////////////////////////////////////////////////////////////
export const selectPreviewFeeLoading = (state: RootState) => state.bridges.previewFeeLoading
export const selectPreviewFee = (state: RootState): string | null => state.bridges.previewFee
export const selectPreviewFeeAsBigInt = createSelector([selectPreviewFee], (previewFee): bigint => {
  return previewFee ? BigInt(previewFee) : BigInt(0)
})
export const selectFormattedPreviewFee = createSelector(
  [selectPreviewFeeAsBigInt, selectUsdPerEthRate, selectChainConfig],
  (previewFee, price, chainConfig): string => {
    if (!previewFee) {
      price = BigInt(0)
    }
    const formattedPreviewFee = currencySwitch(previewFee, price, {
      usdDigits: 2,
      ethDigits: 7,
    })
    return formattedPreviewFee
  }
)
export const selectShouldTriggerPreviewFee = createSelector(
  [selectDepositAmount, selectInputError, selectLayerZeroChainSelector, selectSourceChainKey, selectAddress],
  (inputAmount, error, layerZeroChainSelector, sourceChainKey, address): boolean => {
    const isConnected = !!address
    const isOnL1 = sourceChainKey === ChainKey.ETHEREUM
    const hasLayerZeroChainSelector = layerZeroChainSelector !== null
    const isNotEmpty = inputAmount.trim().length > 0
    const isGreaterThanZero = parseFloat(inputAmount) > 0
    const hasNoError = !error
    const result = isConnected && isOnL1 && hasLayerZeroChainSelector && isNotEmpty && isGreaterThanZero && hasNoError
    return result
  }
)

/////////////////////////////////////////////////////////////////////
// Desposit Selectors
/////////////////////////////////////////////////////////////////////
export const selectDepositPending = createSelector([(state: RootState) => state], (state) => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.deposit.pending
})
export const selectDepositDisabled = createSelector(
  [selectDepositAmount, selectInputError, selectDepositPending, selectPreviewFee, selectShouldTriggerPreviewFee],
  (from, error, pending, previewFee, shouldTriggerPreviewFee): boolean => {
    const isEmpty = from.trim().length === 0
    const isLessThanOrEqualToZero = parseFloat(from) <= 0
    const isError = !!error
    const isPending = !!pending
    const isPreviewFeeApplicableButNotReady = shouldTriggerPreviewFee && previewFee === null
    return isEmpty || isLessThanOrEqualToZero || isError || isPending || isPreviewFeeApplicableButNotReady
  }
)
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

/////////////////////////////////////////////////////////////////////
// Fun Selectors
/////////////////////////////////////////////////////////////////////
export const selectShouldUseFunCheckout = createSelector(
  [selectWalletHasEnoughBalance, selectSourceChainKey],
  (walletHasEnoughBalance, sourceChainKey) => {
    const isFunkitEnabled = USE_FUNKIT
    const isSourceChainEthereum = sourceChainKey === ChainKey.ETHEREUM
    return isFunkitEnabled && !walletHasEnoughBalance && isSourceChainEthereum
  }
)

export const selectDepositAndBridgeCheckoutParams = (minimumMint: bigint) =>
  createSelector(
    [
      selectSourceTokenKey,
      selectDepositAssetAddress,
      selectDepositAmountAsBigInt,
      selectAddress,
      selectFeeTokenAddress,
      selectPreviewFeeAsBigInt,
      selectDepositAmount,
      selectContractAddressByName('boringVault'),
      selectContractAddressByName('teller'),
      selectDepositBridgeData,
    ],
    (
      depositAssetTokenKey,
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
      const VERB = 'Buy'

      // Values
      const fromTokenInfo = depositAssetTokenKey ? tokensConfig[depositAssetTokenKey] : null

      // Null checks
      if (!userAddress || !feeTokenAddress || !depositAssetAddress) {
        return null
      }

      // Derived Values
      // const paddedFee = (feeAsBigInt * BigInt(101)) / BigInt(100)

      // Build the checkout params
      return {
        modalTitle: `${VERB} ${fromTokenInfo?.name}`,
        iconSrc: `/assets/svgs/token-${fromTokenInfo?.key}.svg`,
        actionsParams: [
          // Approve the ERC20 token
          // {
          //   contractAbi: erc20Abi,
          //   contractAddress: depositAssetAddress,
          //   functionName: 'approve',
          //   functionArgs: [boringVaultAddress, depositAmount],
          // },
          // // Deposit the token
          // {
          //   contractAbi: CrossChainTellerBaseAbi.abi as Abi,
          //   contractAddress: tellerContractAddress,
          //   functionName: 'depositAndBridge',
          //   functionArgs: [depositAssetAddress, depositAmount, minimumMint, depositBridgeData],
          //   value: paddedFee,
          // },
        ],
        targetChain: '1',
        targetAsset: depositAssetAddress,
        targetAssetAmount: parseFloat(fromAmount),
        targetAssetTicker: fromTokenInfo?.name,
        checkoutItemTitle: `${VERB} ${fromTokenInfo?.name}`,
        checkoutItemDescription: `${VERB} ${fromTokenInfo?.name}`,
        checkoutItemAmount: parseFloat(fromAmount),
        expirationTimestampMs: 3600000,
        disableEditing: false,
      }
    }
  )
