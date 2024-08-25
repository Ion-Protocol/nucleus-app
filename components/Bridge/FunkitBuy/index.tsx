import { getRateInQuote } from '@/api/contracts/Accountant/getRateInQuote'
import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import TellerWithMultiAssetSupport from '@/contracts/TellerWithMultiAssetSupport.json'
import { useAppSelector } from '@/store/hooks'
import { selectBridgeConfig, selectSourceBridgeChainId } from '@/store/slices/bridges'
import { WAD } from '@/utils/bigint'
import { FunkitPaymentsIconLine, useConnectModal, useFunkitCheckout } from '@funkit/connect'
import { useCallback } from 'react'
import { Abi, erc20Abi } from 'viem'
import { FunkitBuyConnector } from './connector'

const VERB = 'Deposit and bridge'

function FunkitBuy({ fromTokenInfo, fromChain, fromAmount, loading, disabled }: FunkitBuyConnector.Props) {
  const { openConnectModal } = useConnectModal()
  const { beginCheckout } = useFunkitCheckout({
    onLoginRequired: openConnectModal,
  })
  const bridgeConfig = useAppSelector(selectBridgeConfig)
  const chainId = useAppSelector(selectSourceBridgeChainId)

  const onFunkitBuy = useCallback(async () => {
    const fromAmountBigInt = BigInt(parseFloat(fromAmount) * WAD.number)
    const tokenAddress = fromChain ? fromTokenInfo?.chains[fromChain]?.address : null
    if (!tokenAddress || !bridgeConfig || !chainId) return

    const accountantContractAddress = bridgeConfig.contracts.accountant
    const callingContractAddress = bridgeConfig.contracts.teller
    const allowanceContractAddress = bridgeConfig.contracts.boringVault

    const rate = await getRateInQuote({ quote: tokenAddress }, { contractAddress: accountantContractAddress, chainId })
    const minimumMintAmount = calculateMinimumMint(fromAmountBigInt, rate)

    try {
      await beginCheckout({
        modalTitle: `${VERB} ${fromTokenInfo?.name}`,
        iconSrc: `/assets/svgs/token-${fromTokenInfo?.key}.svg`,
        actionsParams: [
          // Approve the ERC20 token
          {
            contractAbi: erc20Abi,
            contractAddress: tokenAddress,
            functionName: 'approve',
            functionArgs: [allowanceContractAddress, fromAmountBigInt],
          },
          // Deposit the token
          {
            contractAbi: TellerWithMultiAssetSupport.abi as Abi,
            contractAddress: callingContractAddress,
            functionName: 'deposit',
            functionArgs: [tokenAddress, fromAmountBigInt, minimumMintAmount],
          },
        ],
        targetChain: chainId.toString(),
        targetAsset: tokenAddress,
        targetAssetAmount: parseFloat(fromAmount),
        checkoutItemTitle: `Bridge ${fromTokenInfo?.name}`,
        checkoutItemDescription: `${VERB} ${fromTokenInfo?.name}`,
        checkoutItemAmount: parseFloat(fromAmount),
        expirationTimestampMs: 3600000,
        disableEditing: true,
      })
    } catch (error) {
      console.error(error)
    }
  }, [
    beginCheckout,
    bridgeConfig,
    chainId,
    fromAmount,
    fromChain,
    fromTokenInfo?.chains,
    fromTokenInfo?.key,
    fromTokenInfo?.name,
  ])

  return (
    <ConnectAwareButton
      h="fit-content"
      display="flex"
      alignItems="center"
      gap="2"
      p={2}
      isLoading={loading}
      onClick={onFunkitBuy}
      isDisabled={disabled}
      _hover={disabled || loading ? {} : undefined}
      _active={disabled || loading ? {} : undefined}
    >
      {VERB} {fromTokenInfo?.name}
      <FunkitPaymentsIconLine />
    </ConnectAwareButton>
  )
}

export default FunkitBuyConnector.Connector(FunkitBuy)
