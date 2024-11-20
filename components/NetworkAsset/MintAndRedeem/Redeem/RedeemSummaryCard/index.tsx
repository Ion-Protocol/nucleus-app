import React from 'react'
import { useSelector } from 'react-redux'
import {
  Flex,
  Text,
  Box,
  Heading,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import {
  selectIsBridgeRequired,
  selectReceiveTokenKey,
  selectReceiveTokens,
  selectTokenAddressByTokenKey,
  selectContractAddressByName,
  selectSourceChainId,
  selectNetworkAssetConfig,
  selectRedemptionSourceChainId,
  selectDestinationChainId,
  selectRedeemAmount,
  selectReceiveAmount,
} from '@/store/slices/networkAssets/selectors'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'
import { Address } from 'viem'
import { RootState } from '@/store'
import { tokensConfig } from '@/config/tokens'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { useGetPreviewFeeQuery } from '@/store/api/tellerApi'
import { useRedeemSelectors } from '@/hooks/useRedeemSelectors'
import { TokenIcon } from '@/components/config/tokenIcons'
import { TokenKey } from '@/types/TokenKey'
import { ChainIcon } from '@/components/config/chainIcons'
import { ChainKey } from '@/types/ChainKey'
import { capitalizeFirstLetter } from '@/utils/string'

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
    tellerContractAddress,
    redemptionSourceChainId,
    userAddress,
    layerZeroChainSelector,
    redeemBridgeData,
    redemptionSourceChainKey,
    destinationChainKey,
  } = useRedeemSelectors()
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  const isBridgeRequired = useSelector(selectIsBridgeRequired)
  const tokenKeys = useSelector(selectReceiveTokens)
  const receiveTokenKey = useSelector(selectReceiveTokenKey) || tokenKeys[0]
  const receiveAssetAddress = useSelector((state: RootState) => selectTokenAddressByTokenKey(state, receiveTokenKey))
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const formattedRedeemAmount = useSelector(selectRedeemAmount)
  const formattedReceiveAmount = useSelector(selectReceiveAmount)
  const chainId = useSelector(selectSourceChainId)
  const receiveToken = tokensConfig[receiveTokenKey as keyof typeof tokensConfig]
  const sharesTokenKey = networkAssetConfig?.token.name

  const { data: tokenRateInQuote } = useGetRateInQuoteSafeQuery({
    quote: receiveAssetAddress! as Address,
    contractAddress: accountantAddress!,
    chainId: chainId!,
  })

  const {
    data: previewFee,
    isSuccess: isPreviewFeeSuccess,
    isError: isPreviewFeeError,
    error: previewFeeError,
  } = useGetPreviewFeeQuery(
    {
      shareAmount: redeemAmount,
      bridgeData: redeemBridgeData!,
      contractAddress: tellerContractAddress!,
      chainId: redemptionSourceChainId!,
    },
    { skip: !userAddress || layerZeroChainSelector === 0 || !redeemAmount }
  )

  const rateInQuoteWithFee = tokenRateInQuote?.rateInQuoteSafe
    ? (tokenRateInQuote.rateInQuoteSafe * BigInt(9980)) / BigInt(10000)
    : BigInt(0)

  const formattedPrice = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 4 })

  return (
    <Box p={6} bg={'successDialogSummary'} borderRadius="lg" boxShadow="sm" paddingBottom={2}>
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
              flexDirection={'column'}
              flex={1}
              paddingX={0}
              paddingBottom={0}
              width="100%"
              _hover={'none'}
            >
              <Flex flexDirection="column" gap={1} width="100%">
                <SummaryRow
                  label={`Redeem from`}
                  chainKey={redemptionSourceChainKey ? redemptionSourceChainKey : undefined}
                  value={`${formattedRedeemAmount} ${sharesTokenKey}`}
                />
                <SummaryRow
                  label={`Receive on`}
                  chainKey={destinationChainKey ? destinationChainKey : undefined}
                  value={`${formattedReceiveAmount} ${receiveToken?.name}`}
                />
              </Flex>
              <Flex justifyContent={'center'}>
                <AccordionIcon color="gray.500" />
              </Flex>
            </AccordionButton>
            <AccordionPanel paddingX={0} paddingTop={0}>
              <Flex flexDirection="column" gap={1}>
                <SummaryRow label="Price" value={`${formattedPrice} ${receiveToken?.name} / ${sharesTokenKey}`} />
                {isBridgeRequired && (
                  <SummaryRow
                    label="Bridge Fee"
                    value={`${previewFee?.truncatedFeeAsString} ${capitalizeFirstLetter(redemptionSourceChainKey!)}`}
                  />
                )}
                <SummaryRow label="Withdraw Fee" value={'0.2%'} />
                <SummaryRow label="Deadline" value={'3 days'} />
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
  chainKey,
  value,
  dotted = true,
}: {
  label: string
  chainKey?: ChainKey
  value: string | React.ReactNode
  dotted?: boolean
}) => (
  <Flex align="center" justifyContent="space-between">
    {chainKey ? (
      <Flex color="tooltipLabel" alignItems={'center'} gap={1} fontSize="15px">
        <Text as="span" color="tooltipLabel" fontSize="15px">
          {label}
        </Text>
        <ChainIcon chainKey={chainKey} />
        <Text as="span" color="tooltipLabel" fontSize="15px">
          {capitalizeFirstLetter(chainKey)}
        </Text>
      </Flex>
    ) : (
      <Text color="tooltipLabel" fontSize="15px">
        {label}
      </Text>
    )}
    {dotted && (
      <Box flex="1" mx={2} paddingTop={1} borderBottom="1px" borderStyle="dotted" borderColor="tooltipLabel" />
    )}
    <Text color="tooltipLabel" fontSize="15px" fontWeight="medium">
      {value}
    </Text>
  </Flex>
)

export default RedeemSummaryCard
