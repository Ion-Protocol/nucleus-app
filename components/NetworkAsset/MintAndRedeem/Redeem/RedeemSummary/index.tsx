import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { Address } from 'viem'

import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { selectAddress } from '@/store/slices/account/'
import { useGetRateInQuoteSafeQuery } from '@/store/slices/accountantApi'
import { useGetTokenPriceQuery } from '@/store/slices/coinGecko'
import {
  selectRedeemAmountAsBigInt,
  selectRedeemBridgeData,
  selectWithdrawalFee,
} from '@/store/slices/networkAssets/selectors'
import { useGetPreviewFeeQuery } from '@/store/slices/tellerApi'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { applyWithdrawalFeeReduction } from '@/utils/withdrawal'
import { RedeemSummaryConnector } from './connector'

// TODO: Move to a better place? or componentize the dropdown?
export const RedeemSummaryCopy = {
  bridgeFee: {
    label: 'Bridge Fee',
    tooltip:
      'Fees are charged by the underlying bridge provider such as LayerZero or Hyperlane. These fees are an estimate and any unused amount will be refunded to the user.',
  },
  redemptionPrice: {
    label: 'Redemption Price',
    tooltip:
      'Redemption price is the current exchange rate discounted by the withdraw fee. This price determines how much assets you receive from the withdrawal.',
  },
  exchangeRate: {
    label: 'Exchange Rate',
    tooltip:
      'The current exchange rate used to calculate the redemption price that is not inclusive of the withdrawal fee.',
  },
  withdrawFee: {
    label: 'Withdraw Fee',
    tooltip:
      'Withdraw fees are applied in order to incentivize solvers to process withdraw orders into arbitrary requested assets.',
  },
  deadline: {
    label: 'Deadline',
    tooltip: 'If the deadline is reached, your order will automatically expire and will not be processed.',
  },
}

function RedeemSummary({
  accountantAddress,
  tellerAddress,
  receiveToken,
  networkAssetName,
  isBridgeRequired,
  nativeTokenForBridgeFee,
  receiveAssetAddress,
  chainId,
  bridgeFromChainId,
}: RedeemSummaryConnector.Props) {
  const userAddress = useSelector(selectAddress)
  const redeemAmountAsBigInt = useSelector(selectRedeemAmountAsBigInt)
  const bridgeData = useSelector(selectRedeemBridgeData)

  const {
    data: previewFee,
    isSuccess: isPreviewFeeSuccess,
    isLoading: isPreviewFeeLoading,
    isError: isPreviewFeeError,
    error: previewFeeError,
  } = useGetPreviewFeeQuery(
    {
      shareAmount: redeemAmountAsBigInt,
      bridgeData: bridgeData!,
      contractAddress: tellerAddress!,
      chainId: bridgeFromChainId!,
    },
    { skip: !userAddress || !redeemAmountAsBigInt || !isBridgeRequired || !bridgeData }
  )

  const { data: tokenPrice, isSuccess: tokenPriceSuccess } = useGetTokenPriceQuery('sei-network')
  const { data: tokenRateInQuote, isSuccess: tokenRateInQuoteSuccess } = useGetRateInQuoteSafeQuery({
    quote: receiveAssetAddress! as Address,
    contractAddress: accountantAddress!,
    chainId: chainId!,
  })

  const withdrawalFee = useSelector(selectWithdrawalFee)

  const rateInQuoteWithFee = tokenRateInQuote?.rateInQuoteSafe
    ? applyWithdrawalFeeReduction(BigInt(tokenRateInQuote?.rateInQuoteSafe), withdrawalFee)
    : BigInt(0)

  const formattedPrice = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 4 })
  const formattedPriceFull = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 18 })

  const formattedPreviewFee = previewFee?.feeAsString && tokenPrice ? Number(previewFee.feeAsString) * tokenPrice : 0

  return (
    <Accordion allowToggle>
      <AccordionItem borderTop="none">
        <AccordionButton _hover={{ bg: 'none' }} paddingX={0} paddingBottom={4}>
          <Flex direction="column" width="100%" gap={3}>
            {/* Bridge Fee */}
            {isBridgeRequired && (
              <Flex align="center" justify="space-between">
                <Flex gap={2} align="center">
                  <Text variant="paragraph">Bridge Fee</Text>
                  <IonTooltip label="Fees are charged by the underlying bridge provider such as LayerZero or Hyperlane. These fees are an estimate and any unused amount will be refunded to the user.">
                    <InfoOutlineIcon mt={'2px'} fontSize="sm" />
                  </IonTooltip>
                </Flex>
                <IonSkeleton minW="75px" isLoaded={!isPreviewFeeLoading}>
                  <IonTooltip label={`${previewFee?.feeAsString} ${nativeTokenForBridgeFee?.toUpperCase()}`}>
                    <Text textAlign="right" variant="paragraph">
                      {formattedPreviewFee
                        ? `${previewFee?.truncatedFeeAsString} ${nativeTokenForBridgeFee?.toUpperCase()} (≈ ${formattedPreviewFee.toFixed(4)} USD)`
                        : '0'}
                    </Text>
                  </IonTooltip>
                </IonSkeleton>
              </Flex>
            )}
            <Flex align="center" justify="space-between" flex="1">
              <Flex gap={2} align="center">
                <Text variant="paragraph">{RedeemSummaryCopy.redemptionPrice.label}</Text>
                <IonTooltip label={RedeemSummaryCopy.redemptionPrice.tooltip}>
                  <InfoOutlineIcon mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={tokenRateInQuoteSuccess}>
                <Flex align="center">
                  <IonTooltip label={formattedPriceFull}>
                    <Text textAlign="right" variant="paragraph">
                      {`${formattedPrice} ${receiveToken} / ${networkAssetName}`}
                    </Text>
                  </IonTooltip>
                  <AccordionIcon />
                </Flex>
              </IonSkeleton>
            </Flex>
          </Flex>
        </AccordionButton>

        <AccordionPanel paddingTop={0} paddingBottom={3}>
          <Flex direction="column" gap={3}>
            {/* Exchange Rate */}
            <Flex align="center" justify="space-between">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  {RedeemSummaryCopy.exchangeRate.label}
                </Text>
                <IonTooltip label={RedeemSummaryCopy.exchangeRate.tooltip}>
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={tokenRateInQuoteSuccess}>
                <IonTooltip label={tokenRateInQuote?.rateInQuoteSafeAsString}>
                  <Text textAlign="right" variant="paragraph" color="disabledText">
                    {`${tokenRateInQuote?.truncatedRateInQuoteSafeAsString} ${receiveToken} / ${networkAssetName}`}
                  </Text>
                </IonTooltip>
              </IonSkeleton>
            </Flex>
            {/* Withdrawal Fee */}
            <Flex align="center" justify="space-between">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  {RedeemSummaryCopy.withdrawFee.label}
                </Text>
                <IonTooltip label={RedeemSummaryCopy.withdrawFee.tooltip}>
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={true}>
                <Text textAlign="right" variant="paragraph" color="disabledText">
                  {withdrawalFee}%
                </Text>
              </IonSkeleton>
            </Flex>
            {/* Deadline */}
            <Flex align="center" justify="space-between">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  {RedeemSummaryCopy.deadline.label}
                </Text>
                <IonTooltip label={RedeemSummaryCopy.deadline.tooltip}>
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={true}>
                <Text textAlign="right" variant="paragraph" color="disabledText">
                  3 days
                </Text>
              </IonSkeleton>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default RedeemSummaryConnector.Connector(RedeemSummary)
