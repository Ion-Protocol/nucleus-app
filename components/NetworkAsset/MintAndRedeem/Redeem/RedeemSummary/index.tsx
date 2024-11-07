import React from 'react'
import { useSelector } from 'react-redux'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Address } from 'viem'
import { Accordion, AccordionItem, Flex, AccordionButton, AccordionIcon, AccordionPanel, Text } from '@chakra-ui/react'

import { nativeAddress } from '@/config/constants'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { convertToUsd } from '@/utils/currency'
import { selectAddress } from '@/store/slices/account/'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'
import { selectRedeemAmountAsBigInt } from '@/store/slices/networkAssets/selectors'
import { BridgeData, useGetPreviewFeeQuery } from '@/store/api/tellerApi'
import { selectUsdPerEthRate } from '@/store/slices/price/selectors'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { RedeemSummaryConnector } from './connector'
import { useGetTokenPriceQuery } from '@/store/api/coinGecko'

function RedeemSummary({
  accountantAddress,
  tellerAddress,
  receiveToken,
  networkAssetName,
  isSameChain,
  receiveAssetAddress,
  chainId,
  bridgeFromChainId,
  layerZeroChainSelector,
}: RedeemSummaryConnector.Props) {
  const userAddress = useSelector(selectAddress)
  const redeemAmountAsBigInt = useSelector(selectRedeemAmountAsBigInt)

  const previewFeeBridgeData: BridgeData = {
    chainSelector: layerZeroChainSelector,
    destinationChainReceiver: userAddress!,
    bridgeFeeToken: nativeAddress,
    messageGas: BigInt(100000),
    data: '0x',
  }

  const {
    data: previewFee,
    isSuccess: isPreviewFeeSuccess,
    isError: isPreviewFeeError,
    error: previewFeeError,
  } = useGetPreviewFeeQuery(
    {
      shareAmount: redeemAmountAsBigInt,
      bridgeData: previewFeeBridgeData,
      contractAddress: tellerAddress!,
      chainId: bridgeFromChainId!,
    },
    { skip: !userAddress || layerZeroChainSelector === 0 || !redeemAmountAsBigInt }
  )

  const { data: tokenPrice, isSuccess: tokenPriceSuccess } = useGetTokenPriceQuery('sei-network')
  const { data: tokenRateInQuote, isSuccess: tokenRateInQuoteSuccess } = useGetRateInQuoteSafeQuery({
    quote: receiveAssetAddress! as Address,
    contractAddress: accountantAddress!,
    chainId: chainId!,
  })

  const rateInQuoteWithFee = tokenRateInQuote?.rateInQuoteSafe
    ? (tokenRateInQuote.rateInQuoteSafe * BigInt(995)) / BigInt(1000)
    : BigInt(0)

  const formattedPrice = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 4 })
  const formattedPriceFull = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 18 })

  console.log('Preview Fee:', previewFee?.feeAsString, 'Token Price:', tokenPrice)

  const formattedPreviewFee =
    previewFee?.feeAsString && tokenPrice?.['sei-network']?.usd
      ? Number(previewFee.feeAsString) * tokenPrice['sei-network'].usd
      : 0
  console.log('Preview Fee formatted:', formattedPreviewFee)

  return (
    <Accordion allowToggle>
      <AccordionItem borderTop="none">
        <AccordionButton _hover={{ bg: 'none' }} paddingX={0} paddingBottom={4}>
          <Flex align="center" justify="space-between" flex="1">
            <Flex color="secondaryText" gap={2} align="center">
              <Text variant="paragraph" color="disabledText">
                Price
              </Text>
              <IonTooltip label={'Price consists of the current rate of the asset and fees'}>
                <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
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
        </AccordionButton>

        <AccordionPanel paddingX={0} paddingTop={0} paddingBottom={3}>
          <Flex direction="column" gap={3}>
            {/* Bridge Fee */}
            {!isSameChain && (
              <Flex align="center" justify="space-between">
                <Flex color="secondaryText" gap={2} align="center">
                  <Text variant="paragraph" color="disabledText">
                    Bridge Fee
                  </Text>
                  <IonTooltip label="Fees are charged by the underlying bridge provider such as LayerZero or Hyperlane">
                    <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                  </IonTooltip>
                </Flex>
                <IonSkeleton minW="75px" isLoaded={isPreviewFeeSuccess && tokenPriceSuccess}>
                  <Text textAlign="right" variant="paragraph">
                    {formattedPreviewFee ? `${formattedPreviewFee}` : '0'}
                  </Text>
                </IonSkeleton>
              </Flex>
            )}
            {/* Withdrawal Fee */}
            <Flex align="center" justify="space-between">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  Withdraw Fee
                </Text>
                <IonTooltip label="Withdraw fees applied in order to incentivize solvers to process withdraw orders into arbitrary requested assets.">
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={true}>
                <Text textAlign="right" variant="paragraph">
                  0.5%
                </Text>
              </IonSkeleton>
            </Flex>
            {/* Deadline */}
            <Flex align="center" justify="space-between">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  Deadline
                </Text>
                <IonTooltip label={'If the deadline is reached, the transaction will be cancelled.'}>
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={true}>
                <Text textAlign="right" variant="paragraph">
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
