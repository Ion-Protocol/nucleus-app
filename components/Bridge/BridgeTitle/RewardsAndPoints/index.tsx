import { Flex, Text } from '@chakra-ui/react'
import RewardsIconRow from '@/components/shared/RewardsIconRow'
import { useAppSelector } from '@/store/hooks'
import { selectChainKeyFromRoute } from '@/store/slices/router'

function RewardsAndPoints() {
  const chainKey = useAppSelector(selectChainKeyFromRoute)

  return (
    <Flex
      border="1px solid"
      borderColor="border"
      borderRadius="8px"
      py={6}
      px={6}
      direction="column"
      gap={3}
      align="center"
      w="100%"
    >
      <Text variant="paragraph">Rewards & Points</Text>
      <RewardsIconRow chainKey={chainKey} />
    </Flex>
  )
}

export default RewardsAndPoints
