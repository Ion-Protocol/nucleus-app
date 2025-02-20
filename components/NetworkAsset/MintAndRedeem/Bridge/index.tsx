import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { RootState } from '@/store'
import { selectFormattedTokenBalance } from '@/store/slices/balance/selectors'
import { useGetTokenPriceQuery } from '@/store/slices/coinGecko'
import {
  selectBridgeAmount,
  selectBridgeAmountAsBigInt,
  selectBridgeDataForBridge,
  selectBridgeSourceChainId,
  selectBridgeSourceChainKey,
  selectContractAddressByName,
  selectNativeAsset,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { useGetPreviewFeeQuery } from '@/store/slices/tellerApi'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { ChakraProps, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import BridgeDialog from './BridgeDialog'
import BridgeInput from './BridgeInput'
import BridgeSelect from './BridgeSelect'

export function Bridge({ ...props }: ChakraProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bridgeAmount = useSelector(selectBridgeAmount)
  const bridgeAmountAsBigInt = useSelector(selectBridgeAmountAsBigInt)
  const bridgeData = useSelector(selectBridgeDataForBridge)
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const bridgeSourceChainId = useSelector(selectBridgeSourceChainId)
  const bridgeSourceChainKey = useSelector(selectBridgeSourceChainKey)
  const networkAssetFromRoute = useSelector(selectNetworkAssetFromRoute)
  const tokenBalance = useSelector((state: RootState) =>
    selectFormattedTokenBalance(state, bridgeSourceChainKey, networkAssetFromRoute)
  )
  const { data: previewFee, isLoading: previewFeeLoading } = useGetPreviewFeeQuery(
    {
      shareAmount: bridgeAmountAsBigInt,
      bridgeData: bridgeData!,
      contractAddress: tellerContractAddress!,
      chainId: bridgeSourceChainId!,
    },
    {
      skip: !bridgeData || !tellerContractAddress || !bridgeSourceChainId || !bridgeAmountAsBigInt,
    }
  )
  const nativeAsset = useSelector(selectNativeAsset)
  const { data: tokenPrice } = useGetTokenPriceQuery(nativeAsset?.coinGeckoId!, {
    skip: !nativeAsset?.coinGeckoId,
  })
  const formattedPreviewFee = previewFee?.feeAsString && tokenPrice ? Number(previewFee.feeAsString) * tokenPrice : 0
  return (
    <Flex direction="column" {...props} gap={6}>
      <BridgeSelect />
      <BridgeInput />
      <Flex align="center" justify="space-between">
        <Flex color="secondaryText" gap={2} align="center">
          <Text variant="paragraph" color="disabledText">
            Fees
          </Text>
          <IonTooltip
            label={
              'Fees are charged by the underlying bridge provider such as LayerZero or Hyperlane. These fees are an estimate and any unused amount will be refunded to the user.'
            }
          >
            <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
          </IonTooltip>
        </Flex>
        <IonSkeleton minW="75px" isLoaded={!previewFeeLoading}>
          <IonTooltip label={bridgeAmountAsBigInt ? `${previewFee?.feeAsString} ${nativeAsset?.symbol}` : '0'}>
            <Text textAlign="right" variant="paragraph">
              {bridgeAmountAsBigInt
                ? `${previewFee?.truncatedFeeAsString} ${nativeAsset?.symbol} (≈ ${formattedPreviewFee.toFixed(4)} USD)`
                : '0'}
            </Text>
          </IonTooltip>
        </IonSkeleton>
      </Flex>
      <ConnectAwareButton
        h="fit-content"
        p={2}
        gap={1}
        onClick={onOpen}
        isDisabled={
          !bridgeAmountAsBigInt ||
          !bridgeData ||
          !tellerContractAddress ||
          !bridgeSourceChainId ||
          !tokenBalance ||
          bridgeAmount > tokenBalance
        }
      >
        <Text variant="button">Bridge</Text>
      </ConnectAwareButton>
      {previewFee && <BridgeDialog isOpen={isOpen} onClose={onClose} previewFee={previewFee} />}
    </Flex>
  )
}
