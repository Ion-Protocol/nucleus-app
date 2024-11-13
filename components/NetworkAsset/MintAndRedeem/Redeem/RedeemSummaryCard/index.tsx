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
} from '@/store/slices/networkAssets/selectors'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'
import { Address } from 'viem'
import { RootState } from '@/store'
import { tokensConfig } from '@/config/tokens'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { useGetPreviewFeeQuery } from '@/store/api/tellerApi'
import { useRedeemSelectors } from '@/hooks/useRedeemSelectors'

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
  } = useRedeemSelectors()
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  const isBridgeRequired = useSelector(selectIsBridgeRequired)
  const tokenKeys = useSelector(selectReceiveTokens)
  const receiveTokenKey = useSelector(selectReceiveTokenKey) || tokenKeys[0]
  const receiveAssetAddress = useSelector((state: RootState) => selectTokenAddressByTokenKey(state, receiveTokenKey))
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
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
    ? (tokenRateInQuote.rateInQuoteSafe * BigInt(995)) / BigInt(1000)
    : BigInt(0)

  const formattedPrice = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 4 })

  return (
    <Box p={6} bg={'successDialogSummary'} borderRadius="lg" boxShadow="sm" paddingBottom={2}>
      <Heading
        as="h2"
        color="text"
        fontSize="xl"
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
            <AccordionButton display={'flex'} flex={1} paddingX={0} width="100%" _hover={'none'}>
              <Flex flexDirection="column" gap={1} width="100%">
                <SummaryRow label="Redeem" value={'3.50'} />
                <SummaryRow label="Receive" value={'4.20'} />
                <Flex justifyContent={'center'}>
                  <AccordionIcon color="gray.500" />
                </Flex>
              </Flex>
            </AccordionButton>
            <AccordionPanel paddingX={0} paddingTop={1}>
              <Flex flexDirection="column" gap={1}>
                <SummaryRow label="Price" value={`${formattedPrice} ${receiveToken?.name} / ${sharesTokenKey}`} />
                {isBridgeRequired && (
                  <SummaryRow label="Bridge Fee" value={`${previewFee?.truncatedFeeAsString} sei`} />
                )}
                <SummaryRow label="Withdraw Fee" value={'0.5%'} />
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
  value,
  dotted = true,
}: {
  label: string
  value: string | React.ReactNode
  dotted?: boolean
}) => (
  <Flex align="center" justifyContent={'space-between'}>
    <Text color="tooltipLabel" fontSize="lg">
      {label}
    </Text>
    {dotted && <Box flex="1" mx={2} borderBottom="1px" borderStyle="dotted" borderColor="tooltipLabel" />}
    <Text color="tooltipLabel" fontSize="lg" fontWeight="medium">
      {value}
    </Text>
  </Flex>
)

export default RedeemSummaryCard
