import { useRedeem } from '@/hooks/redeem/useRedeem'
import { ChakraProps, Flex } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { atomicQueueContractAddress } from '@/config/constants'
import { tokensConfig } from '@/config/tokens'
import { useRedeemData } from '@/hooks/redeem/useRedeemData'
import { RootState } from '@/store'
import { selectAddress } from '@/store/slices/account'
import { selectTokenBalance } from '@/store/slices/balance'
import { selectNetworkId } from '@/store/slices/chain'
import {
  selectContractAddressByName,
  selectDestinationChainId,
  selectIsBridgeRequired,
  selectNetworkAssetConfig,
  selectReceiveTokenKey,
  selectReceiveTokens,
  selectRedeemAmountAsBigInt,
  selectRedeemBridgeData,
  selectRedeemLayerZeroChainSelector,
  selectRedemptionDestinationChainKey,
  selectRedemptionSourceChainId,
  selectRedemptionSourceChainKey,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { ChainKey } from '@/types/ChainKey'
import { RedeemConfig } from '@/types/Redeem'
import { prepareAtomicRequestData } from '@/utils/atomicRequest'
import { calculateRedeemDeadline } from '@/utils/time'
import React from 'react'
import { useSelector } from 'react-redux'
import { Address } from 'viem'
import RedeemChainSelect from './RedeemChainSelect'
import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
interface RedeemProps extends ChakraProps {}

export const Redeem = React.memo(function Redeem({ ...props }: RedeemProps) {
  const deadline = calculateRedeemDeadline() // default value in function is 3 days
  /**
   ******************************************************************************
   * Selectors
   * Note maybe should happen outside of this hook.
   * Data can be checked and transformed also allowing for disable of button
   * and transformation of data to be displayed in the modal.
   ******************************************************************************
   */
  const userAddress = useSelector(selectAddress)
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  /**
   * Ids for tracking the Id of the chain the user is connected to,
   * the source chain of the redemption, and the destination chain where the withdrawal will take place
   */
  const networkId = useSelector(selectNetworkId) // Id of chain user is connected to
  const redemptionSourceChainId = useSelector(selectRedemptionSourceChainId) // Id of chain where redemption starts
  const destinationChainId = useSelector(selectDestinationChainId) // Id of chain where withdrawal will take place
  const redemptionSourceChainKey = useSelector(selectRedemptionSourceChainKey)
  const destinationChainKey = useSelector(selectRedemptionDestinationChainKey)
  const sourceExplorerBaseUrl =
    networkAssetConfig?.redeem.redemptionSourceChains[redemptionSourceChainKey as ChainKey]?.explorerBaseUrl
  const destinationExplorerBaseUrl =
    networkAssetConfig?.redeem.redemptionDestinationChains[destinationChainKey as ChainKey]?.explorerBaseUrl
  console.log('sourceExplorerBaseUrl', sourceExplorerBaseUrl)
  console.log('destinationExplorerBaseUrl', destinationExplorerBaseUrl)

  const isBridgeRequired = useSelector(selectIsBridgeRequired)

  /**
   * Selectors for the accountant address, the teller contract address,
   * and the layer zero chain selector
   */
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const layerZeroChainSelector = useSelector((state: RootState) => selectRedeemLayerZeroChainSelector(state))

  /**
   * Selectors for the redeem amount, the accountant address, the teller contract address,
   * the layer zero chain selector, and the token keys
   */
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)
  const tokenKeys = useSelector(selectReceiveTokens)
  const wantTokenKey = useSelector(selectReceiveTokenKey)

  /**
   * Selectors for token balance on destination chain (always mainnet) and
   * the source chain. This is a safety guard to check if user has funds on mainnet
   * from a previous bridge but failure to redeem.
   */

  const destinationTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, destinationChainKey, wantTokenKey)
  )
  const sourceTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, redemptionSourceChainKey, wantTokenKey)
  )

  const bridgeData = useSelector(selectRedeemBridgeData)

  const networkAssetFromRoute = useSelector(selectNetworkAssetFromRoute)
  const tokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, redemptionSourceChainKey, networkAssetFromRoute)
  )

  const isValid = Boolean(
    redeemAmount > BigInt(0) &&
      networkAssetConfig &&
      networkId &&
      redemptionSourceChainId &&
      destinationChainId &&
      redemptionSourceChainKey &&
      destinationChainKey &&
      accountantAddress &&
      tellerContractAddress &&
      sourceExplorerBaseUrl &&
      destinationExplorerBaseUrl
  )

  const sharesTokenAddress = networkAssetConfig?.token.addresses[redemptionSourceChainKey!]
  const sharesTokenKey = networkAssetConfig?.token.key

  const effectiveWantTokenKey = wantTokenKey || tokenKeys[0] || null

  const wantTokenAddress = effectiveWantTokenKey
    ? tokensConfig[effectiveWantTokenKey as keyof typeof tokensConfig].addresses[destinationChainKey!]
    : null
  // Build config object
  const config: RedeemConfig = {
    userAddress: userAddress!,
    redeemAmount,
    sharesTokenAddress: sharesTokenAddress as Address,
    wantTokenAddress: wantTokenAddress as Address,
    destinationChainId: destinationChainId!,
    redemptionSourceChainId: redemptionSourceChainId!,
    isBridgeRequired,
    bridgeData: bridgeData!,
    deadline: BigInt(calculateRedeemDeadline()),
  }

  const { allowance, tokenRateInQuote, previewFee } = useRedeemData(config)
  const { handleRedeem, isLoading } = useRedeem()

  const handleRedeemClick = async () => {
    if (!destinationChainId || !redemptionSourceChainId) {
      console.error('Destination or source chain ID is not set')
      return
    }
    if (!tokenRateInQuote?.rateInQuoteSafe) {
      console.error('Token rate in quote is not set')
      return
    }
    if (!sourceExplorerBaseUrl || !destinationExplorerBaseUrl) {
      console.error('Source or destination explorer base URL is not set')
      return
    }
    // Apply 0.2% fee to the rateInQuoteSafe
    const rateInQuoteWithFee = (BigInt(tokenRateInQuote.rateInQuoteSafe) * BigInt(9980)) / BigInt(10000)

    const { atomicRequestArgs, atomicRequestOptions } = prepareAtomicRequestData(
      deadline,
      rateInQuoteWithFee,
      redeemAmount,
      sharesTokenAddress as Address,
      wantTokenAddress as Address,
      atomicQueueContractAddress as Address,
      destinationChainId
    )

    // Create userRequest object with Fee applied
    const atomicRequestData = {
      atomicRequestArgs,
      atomicRequestOptions,
    }

    if (isBridgeRequired) {
      if (!previewFee?.fee || !bridgeData || !tellerContractAddress) {
        console.error('Preview fee is not set')
        return
      }
      const redeemWithBridgeData = {
        tellerContractAddress: tellerContractAddress,
        previewFeeAsBigInt: previewFee.fee,
        layerZeroChainSelector: layerZeroChainSelector,
        bridgeData: bridgeData,
      }
      // Redeem with bridge data
      handleRedeem({
        userAddress: userAddress as Address,
        atomicRequestData,
        redeemAmount,
        allowance,
        sharesTokenAddress: sharesTokenAddress as Address,
        wantTokenAddress: wantTokenAddress as Address,
        isBridgeRequired,
        redemptionSourceChainId,
        destinationChainId,
        redeemWithBridgeData,
        sourceExplorerBaseUrl,
        destinationExplorerBaseUrl,
      })
    } else {
      handleRedeem({
        userAddress: userAddress as Address,
        atomicRequestData,
        redeemAmount,
        allowance,
        sharesTokenAddress: sharesTokenAddress as Address,
        wantTokenAddress: wantTokenAddress as Address,
        isBridgeRequired,
        redemptionSourceChainId,
        destinationChainId,
        sourceExplorerBaseUrl,
        destinationExplorerBaseUrl,
      })
    }
  }

  return (
    <Flex direction="column" gap={6}>
      <RedeemChainSelect role="source" isActive={true} />
      {/* Redeem Token Destination */}
      <RedeemTokenInput />
      {/* Redeem Input */}
      <RedeemChainSelect role="destination" isActive={true} />
      <RedeemTokenDestination />
      {/* Redeem Summary */}
      <RedeemSummary />
      <ConnectAwareButton
        isDisabled={!isValid || redeemAmount > BigInt(tokenBalance || '0')}
        onClick={handleRedeemClick}
        isLoading={isLoading}
      >
        Redeem
      </ConnectAwareButton>
    </Flex>
  )
})
