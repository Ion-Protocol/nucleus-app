import { FunkitBuyConnector } from './connector'
import { Button, Text } from '@chakra-ui/react'
import { useCallback } from 'react'
import { FunkitPaymentsIconLine, useFunkitCheckout, useConnectModal } from '@funkit/connect'
import { Abi, erc20Abi } from 'viem'
import { WAD } from '@/utils/bigint'
import { getRateInQuote } from '@/api/contracts/Accountant/getRateInQuote'
import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import TellerWithMultiAssetSupport from '@/contracts/TellerWithMultiAssetSupport.json'
import { bridgesConfig } from '@/config/bridges'

const VERB = 'Get and bridge'

function FunkitBuy({
  showFunkitBuy,
  bridgeKey,
  fromTokenInfo,
  fromAmount,
  loading,
  disabled,
}: FunkitBuyConnector.Props) {
  const { openConnectModal } = useConnectModal()
  const { beginCheckout } = useFunkitCheckout({
    onLoginRequired: openConnectModal,
  })

  const onFunkitBuy = useCallback(async () => {
    const fromAmountBigInt = BigInt(parseFloat(fromAmount) * WAD.number)
    const rate = await getRateInQuote({ quote: fromTokenInfo.address }, { bridgeKey })
    const minimumMintAmount = calculateMinimumMint(fromAmountBigInt, rate)
    const bridge = bridgesConfig[bridgeKey]
    const callingContractAddress = bridge.contracts.teller
    const allowanceContractAddress = bridge.contracts.boringVault
    await beginCheckout({
      modalTitle: `${VERB} ${fromTokenInfo.name}`,
      iconSrc: `/assets/svgs/token-${fromTokenInfo.key}.svg`,
      actionsParams: [
        // Approve the ERC20 token
        {
          contractAbi: erc20Abi,
          contractAddress: fromTokenInfo.address,
          functionName: 'approve',
          functionArgs: [allowanceContractAddress, fromAmountBigInt],
        },
        // Deposit the token
        {
          contractAbi: TellerWithMultiAssetSupport.abi as Abi,
          contractAddress: callingContractAddress,
          functionName: 'deposit',
          functionArgs: [fromTokenInfo.address, fromAmountBigInt, minimumMintAmount],
        },
      ],
      targetChain: '1',
      targetAsset: fromTokenInfo.address as `0x${string}`,
      targetAssetAmount: parseFloat(fromAmount),
      checkoutItemTitle: `Bridge ${fromTokenInfo.name}`,
      checkoutItemDescription: `${VERB} ${fromTokenInfo.name}`,
      checkoutItemAmount: parseFloat(fromAmount),
      expirationTimestampMs: 3600000,
      disableEditing: true,
    })
  }, [beginCheckout, bridgeKey, fromAmount, fromTokenInfo.address, fromTokenInfo.key, fromTokenInfo.name])

  return showFunkitBuy ? (
    <Button
      h="fit-content"
      variant="outline"
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
      <Text fontSize="16px" textAlign="center">
        {VERB} {fromTokenInfo.name}
      </Text>
      <FunkitPaymentsIconLine />
    </Button>
  ) : null
}

export default FunkitBuyConnector.Connector(FunkitBuy)
