import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'

import { ChainIcon } from '@/components/config/chainIcons'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { useRedeemSummaryData } from '@/hooks/redeem/useRedeemSummaryData'
import { ChainKey } from '@/types/ChainKey'
import { capitalizeFirstLetter } from '@/utils/string'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { RedeemSummaryCopy } from '../RedeemSummary'

export type RedeemSummaryCardProps = {
  redeemAmount: string
  receiveAmount: string
  bridgeFee?: string
  withdrawSlippage: string
  deadline: string
  total?: string
  totalUsd?: string
}

const RedeemSummaryCard = () => {
  const {
    useGetTokenRateInQuote,
    usePreviewFee,
    withdrawalDestinationChainKey,
    redemptionSourceChainKey,
    withdrawSlippage,
    isBridgeRequired,
    receiveToken,
    sharesTokenKey,
    nativeAsset,
    redeemAmount,
    formattedTokenRateWithFee,
    formattedTokenRateWithFeeFull,
    redeemAmountTruncated,
    receiveAmountTruncated,
    receiveAmountFormattedFull,
    deadline,
  } = useRedeemSummaryData()
  const { data: tokenRateInQuote } = useGetTokenRateInQuote
  const { data: previewFee } = usePreviewFee

  return (
    <Box p={6} bg={'successDialogSummary'} borderRadius="lg" boxShadow="sm">
      <Heading
        as="h2"
        color="text"
        fontSize="15px"
        fontWeight={500}
        mb={2}
        pb={2}
        borderBottom="1px"
        borderColor="gray.200"
      >
        Redeem Summary
      </Heading>

      <VStack spacing={3} align="stretch">
        <Accordion allowToggle>
          <AccordionItem borderBottom={'none'} borderTop={'none'}>
            <AccordionButton
              display={'flex'}
              flex={1}
              paddingX={0}
              paddingBottom={0}
              width="100%"
              _hover={{ bg: 'none' }}
            >
              <Flex flexDirection="column" gap={1} width="100%">
                <SummaryRow
                  label={`Redeem from`}
                  chainKey={redemptionSourceChainKey ? redemptionSourceChainKey : undefined}
                  value={`${redeemAmountTruncated} ${sharesTokenKey}`}
                  fullValue={`${redeemAmount} ${sharesTokenKey}`}
                  darkTextValue
                />
                <SummaryRow
                  label={`Receive on`}
                  chainKey={withdrawalDestinationChainKey ? withdrawalDestinationChainKey : undefined}
                  value={`${receiveAmountTruncated} ${receiveToken?.symbol}`}
                  fullValue={`${receiveAmountFormattedFull} ${receiveToken?.symbol}`}
                  darkTextValue
                />
                {isBridgeRequired && (
                  <SummaryRow
                    label={RedeemSummaryCopy.bridgeFee.label}
                    tooltip={RedeemSummaryCopy.bridgeFee.tooltip}
                    value={`${previewFee?.truncatedFeeAsString} ${nativeAsset?.symbol}`}
                    fullValue={`${previewFee?.feeAsString} ${nativeAsset?.symbol}`}
                    darkTextValue
                  />
                )}
                <SummaryRow
                  label={RedeemSummaryCopy.redemptionPrice.label}
                  tooltip={RedeemSummaryCopy.redemptionPrice.tooltip}
                  value={`${formattedTokenRateWithFee} ${receiveToken?.symbol} / ${sharesTokenKey}`}
                  fullValue={`${formattedTokenRateWithFeeFull} ${receiveToken?.symbol} / ${sharesTokenKey}`}
                  darkTextValue
                  showDropdownIcon
                />
              </Flex>
            </AccordionButton>
            <AccordionPanel paddingBottom={0}>
              <Flex flexDirection="column" gap={1}>
                <SummaryRow
                  label={RedeemSummaryCopy.exchangeRate.label}
                  tooltip={RedeemSummaryCopy.exchangeRate.tooltip}
                  value={`${tokenRateInQuote?.truncatedRateInQuoteSafeAsString} ${receiveToken?.name} / ${sharesTokenKey}`}
                  fullValue={`${tokenRateInQuote?.rateInQuoteSafeAsString} ${receiveToken?.name} / ${sharesTokenKey}`}
                />
                <SummaryRow
                  label={RedeemSummaryCopy.withdrawSlippage.label}
                  tooltip={RedeemSummaryCopy.withdrawSlippage.tooltip}
                  value={`${withdrawSlippage}%`}
                />
                <SummaryRow
                  label={RedeemSummaryCopy.deadline.label}
                  tooltip={RedeemSummaryCopy.deadline.tooltip}
                  value={`${deadline} days`}
                />
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        {/* Total has been removed. Keeping it here for now if that is reveresed */}
        {/* {data.total && data.totalUsd && (
          <Box mt={4} bg="purple.50" borderRadius="lg" p={4}>
            <SummaryRow
              label="Total"
              value={
                <Text color="purple.600">
                  {data.total} ≈ ${data.totalUsd}
                </Text>
              }
              dotted={false}
            />
          </Box>
        )} */}
      </VStack>
    </Box>
  )
}

const SummaryRow = ({
  label,
  tooltip,
  chainKey,
  value,
  fullValue,
  dotted = true,
  showDropdownIcon,
  darkTextValue,
}: {
  label: string
  tooltip?: string
  chainKey?: ChainKey
  value: string | React.ReactNode
  fullValue?: string
  dotted?: boolean
  showDropdownIcon?: boolean
  darkTextValue?: boolean
}) => (
  <Flex align="center" justifyContent="space-between">
    {chainKey ? (
      <Flex color="fullValueLabel" alignItems={'center'} gap={1} fontSize="15px">
        <Text as="span" color="tooltipLabel" fontSize="15px">
          {label}
        </Text>
        <ChainIcon chainKey={chainKey} />
        <Text as="span" color="tooltipLabel" fontSize="15px">
          {capitalizeFirstLetter(chainKey)}
        </Text>
      </Flex>
    ) : (
      <Flex align="center" gap={1}>
        <Text color="tooltipLabel" fontSize="15px">
          {label}
        </Text>
        <IonTooltip label={tooltip}>
          <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
        </IonTooltip>
      </Flex>
    )}
    {dotted && (
      <Box flex="1" mx={2} paddingTop={1} borderBottom="1px" borderStyle="dotted" borderColor="tooltipLabel" />
    )}
    {fullValue ? (
      <IonTooltip label={fullValue}>
        <Text color={darkTextValue ? 'text' : 'tooltipLabel'} fontSize="15px" fontWeight="medium">
          {value}
        </Text>
      </IonTooltip>
    ) : (
      <Text color={darkTextValue ? 'text' : 'tooltipLabel'} fontSize="15px" fontWeight="medium">
        {value}
      </Text>
    )}
    {showDropdownIcon && <AccordionIcon alignSelf={'flex-end'} color="gray.500" />}
  </Flex>
)

export default RedeemSummaryCard
