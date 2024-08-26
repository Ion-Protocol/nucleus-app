import { getRateInQuote } from '@/api/contracts/Accountant/getRateInQuote'
import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import TellerWithMultiAssetSupport from '@/contracts/TellerWithMultiAssetSupport.json'
import { useAppSelector } from '@/store/hooks'
import { selectBridgeConfig, selectSourceBridgeChainId } from '@/store/slices/bridges'
import { WAD } from '@/utils/bigint'
import { useConnectModal, useFunkitCheckout } from '@funkit/connect'
import { useCallback } from 'react'
import { Abi, erc20Abi } from 'viem'
import { SubmitConnector } from './connector'

const VERB = 'Mint'

function Deposit({
  onSubmit,
  shouldUseFunkit,
  fromTokenInfo,
  fromChain,
  fromAmount,
  loading,
  disabled,
}: SubmitConnector.Props) {
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

  const handleClickSubmit = useCallback(async () => {
    if (shouldUseFunkit) {
      onFunkitBuy()
    } else {
      onSubmit()
    }
  }, [onFunkitBuy, onSubmit, shouldUseFunkit])

  return (
    <ConnectAwareButton
      h="fit-content"
      p={2}
      isLoading={loading}
      onClick={handleClickSubmit}
      isDisabled={disabled}
      _hover={!loading && !disabled ? {} : undefined}
      _active={!loading && !disabled ? {} : undefined}
    >
      Mint
    </ConnectAwareButton>
  )
}

export default SubmitConnector.Connector(Deposit)
