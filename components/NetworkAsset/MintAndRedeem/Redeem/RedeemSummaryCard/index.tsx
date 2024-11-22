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
import { useSelector } from 'react-redux'

import { ChainIcon } from '@/components/config/chainIcons'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { tokensConfig } from '@/config/tokens'
import { useRedeemSelectors } from '@/hooks/useRedeemSelectors'
import {
  selectIsBridgeRequired,
  selectNetworkAssetConfig,
  selectReceiveTokenKey,
  selectReceiveTokens,
} from '@/store/slices/networkAssets/selectors'
import { ChainKey } from '@/types/ChainKey'
import { capitalizeFirstLetter } from '@/utils/string'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { RedeemSummaryCopy } from '../RedeemSummary'

export type RedeemSummaryCardProps = {
  redeemAmount: string
  receiveAmount: string
  bridgeFee?: string
  withdrawFee: string
  deadline: string
  total?: string
  totalUsd?: string
}

const RedeemSummaryCard = () => {
  const {
    redeemAmount,
    redeemAmountAsBigInt,
    tellerContractAddress,
    redemptionSourceChainId,
    userAddress,
    layerZeroChainSelector,
    redeemBridgeData,
    redeemAmountTruncated,
    receiveAmountTruncated,
    receiveAmountFormattedFull,
    formattedTokenRateWithFee,
    formattedTokenRateWithFeeFull,
    redemptionSourceChainKey,
    destinationChainKey,
    previewFee,
    tokenRateInQuoteSafeQuery,
  } = useRedeemSelectors()
  const { data: tokenRateInQuoteSafe } = tokenRateInQuoteSafeQuery
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  const isBridgeRequired = useSelector(selectIsBridgeRequired)
  const tokenKeys = useSelector(selectReceiveTokens)
  const receiveTokenKey = useSelector(selectReceiveTokenKey) || tokenKeys[0]
  const receiveToken = tokensConfig[receiveTokenKey as keyof typeof tokensConfig]
  const sharesTokenKey = networkAssetConfig?.token.name

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
                  chainKey={destinationChainKey ? destinationChainKey : undefined}
                  value={`${receiveAmountTruncated} ${receiveToken?.name}`}
                  fullValue={`${receiveAmountFormattedFull} ${receiveToken?.name}`}
                  darkTextValue
                />
                {isBridgeRequired && (
                  <SummaryRow
                    label={RedeemSummaryCopy.bridgeFee.label}
                    tooltip={RedeemSummaryCopy.bridgeFee.tooltip}
                    value={`${previewFee?.truncatedFeeAsString} ${capitalizeFirstLetter(redemptionSourceChainKey!)}`}
                    fullValue={`${previewFee?.feeAsString} ${capitalizeFirstLetter(redemptionSourceChainKey!)}`}
                    darkTextValue
                  />
                )}
                <SummaryRow
                  label={RedeemSummaryCopy.redemptionPrice.label}
                  tooltip={RedeemSummaryCopy.redemptionPrice.tooltip}
                  value={`${formattedTokenRateWithFee} ${receiveToken?.name} / ${sharesTokenKey}`}
                  fullValue={`${formattedTokenRateWithFeeFull} ${receiveToken?.name} / ${sharesTokenKey}`}
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
                  value={`${tokenRateInQuoteSafe?.truncatedRateInQuoteSafeAsString} ${receiveToken?.name} / ${sharesTokenKey}`}
                  fullValue={`${tokenRateInQuoteSafe?.rateInQuoteSafeAsString} ${receiveToken?.name} / ${sharesTokenKey}`}
                />
                <SummaryRow
                  label={RedeemSummaryCopy.withdrawFee.label}
                  tooltip={RedeemSummaryCopy.withdrawFee.tooltip}
                  value={'0.2%'}
                />
                <SummaryRow
                  label={RedeemSummaryCopy.deadline.label}
                  tooltip={RedeemSummaryCopy.deadline.tooltip}
                  value={'3 days'}
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
