import React from 'react'
import { Flex, Text, Box, Heading, VStack } from '@chakra-ui/react'

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
  const data = {
    redeemAmount: '4 ssETH',
    receiveAmount: '2 ETH',
    bridgeFee: '-0.05 ETH',
    deadline: '3 days',
    withdrawFee: '0.05 ETH',
    total: '1.95 ETH',
    totalUsd: '1000 USD',
  }
  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <Heading as="h2" fontSize="xl" fontWeight={500} mb={4} pb={2} borderBottom="1px" borderColor="gray.200">
        Redeem Summary
      </Heading>

      <VStack spacing={3} align="stretch">
        <Flex flexDirection="column" gap={1}>
          <SummaryRow label="Redeem" value={data.redeemAmount} />
          <SummaryRow label="Receive" value={data.receiveAmount} />
        </Flex>
        <Flex flexDirection="column" gap={1}>
          <SummaryRow label="Bridge Fee" value={data.bridgeFee} />
          <SummaryRow label="Withdraw Fee" value={data.withdrawFee} />
          <SummaryRow label="Deadline" value={data.deadline} />
        </Flex>

        {data.total && data.totalUsd && (
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
        )}
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
  <Flex align="center" justify="space-between">
    <Text color="gray.700" fontSize="lg">
      {label}
    </Text>
    {dotted && <Box flex="1" mx={2} borderBottom="1px" borderStyle="dotted" borderColor="gray.300" />}
    <Text fontSize="lg" fontWeight="medium">
      {value}
    </Text>
  </Flex>
)

export default RedeemSummaryCard
