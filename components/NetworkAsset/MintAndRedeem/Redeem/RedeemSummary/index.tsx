import React from 'react'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Address } from 'viem'
import { Accordion, AccordionItem, Flex, AccordionButton, AccordionIcon, AccordionPanel, Text } from '@chakra-ui/react'

import { nativeAddress } from '@/config/constants'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { RedeemSummaryConnector } from './connector'
import { useGetRateInQuoteSafeQuery } from '@/store/api/Accountant/rateInQuoteSafeApi'
import { useSelector } from 'react-redux'
import { selectAddress } from '@/store/slices/account/'
import { selectNetworkAssetConfig, selectRedeemAmountAsBigInt } from '@/store/slices/networkAssets/selectors'
import { BridgeData, useGetPreviewFeeQuery } from '@/store/api/Teller/previewFeeApi'

function RedeemSummary({
  accountantAddress,
  tellerAddress,
  wantToken,
  networkAssetName,
  isSameChain,
  wantAssetAddress,
  chainId,
}: RedeemSummaryConnector.Props) {
  const userAddress = useSelector(selectAddress)
  const chainConfig = useSelector(selectNetworkAssetConfig)
  const redeemAmountAsBigInt = useSelector(selectRedeemAmountAsBigInt)
  const layerZeroChainSelector = chainConfig?.layerZeroChainSelector || 0
  if (!userAddress) {
    console.log('userAddress is undefined')
  }

  const previewFeeBridgeData: BridgeData = {
    chainSelector: layerZeroChainSelector,
    destinationChainReceiver: userAddress!,
    bridgeFeeToken: nativeAddress,
    messageGas: BigInt(100000),
    data: '0x',
  }

  const {
    data: previewFee,
    isLoading: previewFeeLoading,
    isFetching: previewFeeFetching,
    isError: previewFeeError,
  } = useGetPreviewFeeQuery(
    {
      shareAmount: redeemAmountAsBigInt,
      bridgeData: previewFeeBridgeData,
      contractAddress: tellerAddress!,
      chainId: chainId!,
    },
    { skip: !userAddress || layerZeroChainSelector === 0 || !redeemAmountAsBigInt }
  )
  console.log('previewFee', previewFee)
  console.log('previewFee', previewFee)
  const { data: tokenRateInQuote, isSuccess: tokenRateInQuoteSuccess } = useGetRateInQuoteSafeQuery({
    quote: wantAssetAddress! as Address,
    contractAddress: accountantAddress!,
    chainId: chainId!,
  })
  return (
    <>
      <Accordion allowToggle>
        <AccordionItem borderTop="none">
          <AccordionButton _hover={{ bg: 'none' }} paddingX={0} paddingBottom={4}>
            <Flex align="center" justify="space-between" flex="1">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  Price
                </Text>
                <IonTooltip label={'Price Label'}>
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={tokenRateInQuoteSuccess}>
                <Flex align="center">
                  <IonTooltip label={tokenRateInQuote?.rateInQuoteSafeAsString}>
                    <Text textAlign="right" variant="paragraph">
                      {`${tokenRateInQuote?.truncatedRateInQuoteSafeAsString} ${wantToken} / ${networkAssetName}`}
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
                  <IonSkeleton minW="75px" isLoaded={!previewFeeLoading || !previewFeeFetching}>
                    <Text textAlign="right" variant="paragraph">
                      {previewFee ? `${previewFee.feeAsString}` : '0'}
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
                  <IonTooltip label={'Testing Label'}>
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
      {/* ! I don't think this is needed. Delete after review */}
      {/* <Flex align="center" justify="space-between">
        <Flex color="secondaryText" gap={2} align="center">
          <Text variant="paragraph" color="disabledText">
            Total
          </Text>
          <IonTooltip label={'Testing Label'}>
            <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
          </IonTooltip>
        </Flex>
        <IonSkeleton minW="75px" isLoaded={true}>
          <Text textAlign="right" variant="paragraph">
            $23.43
          </Text>
        </IonSkeleton>
      </Flex> */}
    </>
  )
}

export default RedeemSummaryConnector.Connector(RedeemSummary)
