import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Text } from '@chakra-ui/react'

import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { useRedeemSummaryData } from '@/hooks/redeem/useRedeemSummaryData'
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
  withdrawSlippage: {
    label: 'Withdraw Slippage',
    tooltip:
      'Withdrawal slippage is the amount of slippage that is applied to the withdrawal. This slippage is applied in order to incentivize solvers to process withdraw orders into arbitrary requested assets.',
  },
  deadline: {
    label: 'Deadline',
    tooltip: 'If the deadline is reached, your order will automatically expire and will not be processed.',
  },
}

function RedeemSummary({}: RedeemSummaryConnector.Props) {
  const {
    useGetTokenRateInQuote,
    usePreviewFee,
    withdrawalDestinationChainKey,
    redemptionSourceChainKey,
    sharesTokenKey,
    redeemAmountAsBigInt,
    withdrawSlippage,
    isBridgeRequired,
    receiveToken,
    nativeAsset,
    formattedTokenRateWithFee,
    formattedTokenRateWithFeeFull,
    formattedPreviewFee,
  } = useRedeemSummaryData()
  const { data: previewFee, isLoading: isPreviewFeeLoading } = usePreviewFee
  const { data: tokenRateInQuote, isSuccess: tokenRateInQuoteSuccess } = useGetTokenRateInQuote

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
                  <IonTooltip label={redeemAmountAsBigInt ? `${previewFee?.feeAsString} ${nativeAsset?.symbol}` : '0'}>
                    <Text textAlign="right" variant="paragraph">
                      {redeemAmountAsBigInt
                        ? `${previewFee?.truncatedFeeAsString} ${nativeAsset?.symbol} (≈ ${formattedPreviewFee.toFixed(4)} USD)`
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
                  <IonTooltip label={formattedTokenRateWithFeeFull}>
                    <Text textAlign="right" variant="paragraph">
                      {`${formattedTokenRateWithFee} ${receiveToken?.symbol} / ${sharesTokenKey}`}
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
                    {`${tokenRateInQuote?.truncatedRateInQuoteSafeAsString} ${receiveToken?.symbol} / ${sharesTokenKey}`}
                  </Text>
                </IonTooltip>
              </IonSkeleton>
            </Flex>
            {/* Withdrawal Fee */}
            <Flex align="center" justify="space-between">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  {RedeemSummaryCopy.withdrawSlippage.label}
                </Text>
                <IonTooltip label={RedeemSummaryCopy.withdrawSlippage.tooltip}>
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={true}>
                <Text textAlign="right" variant="paragraph" color="disabledText">
                  {Number(withdrawSlippage).toFixed(2)}%
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
