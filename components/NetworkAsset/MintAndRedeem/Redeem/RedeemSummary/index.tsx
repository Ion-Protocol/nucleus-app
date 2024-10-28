import React from 'react'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Accordion, AccordionItem, Flex, AccordionButton, AccordionIcon, AccordionPanel, Text } from '@chakra-ui/react'

import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { RedeemSummaryConnector } from './connector'
import { useGetRateInQuoteSafeQuery } from '@/store/api/Accountant/rateInQuoteSafeApi'

function RedeemSummary({
  bridgeFee,
  bridgeFeeLoading,
  exchangeRate,
  truncatedExchangeRate,
  wantToken,
  networkAssetName,
  isSameChain,
  accountantAddress,
  wantAssetAddress,
  chainId,
}: RedeemSummaryConnector.Props) {
  const { data: tokenRateInQuote, isSuccess: tokenRateInQuoteSuccess } = useGetRateInQuoteSafeQuery({
    quote: wantAssetAddress,
    contractAddress: accountantAddress,
    chainId: chainId,
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
                  <Text textAlign="right" variant="paragraph">
                    {`${tokenRateInQuote?.truncatedRateInQuoteSafeAsString} ${wantToken} / seiyanETH`}
                  </Text>
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
                  <IonSkeleton minW="75px" isLoaded={bridgeFeeLoading}>
                    <Text textAlign="right" variant="paragraph">
                      {bridgeFee}
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
              {/* TODO: Delete this once everything is confirmed */}
              {/* According to ticket This means we don't need a receive at least field because Receive is the exact amount that the users will get. */}
              {/* <Flex align="center" justify="space-between">
                <Flex color="secondaryText" gap={2} align="center">
                  <Text variant="paragraph" color="disabledText">
                    Received at least
                  </Text>
                  <IonTooltip label={'Testing Label'}>
                    <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                  </IonTooltip>
                </Flex>
                <IonSkeleton minW="75px" isLoaded={true}>
                  <Text textAlign="right" variant="paragraph">
                    1.05 ETH
                  </Text>
                </IonSkeleton>
              </Flex> */}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Flex align="center" justify="space-between">
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
      </Flex>
    </>
  )
}

export default RedeemSummaryConnector.Connector(RedeemSummary)
