import { Flex, Skeleton, Text } from '@chakra-ui/react'
import { WonderstruckSkeleton } from '../WonderstruckSkeleton'

interface PortfolioSummaryItemProps {
  title: string
  body: string
  subtext: string
  subtextColor?: string
  sideTag?: React.ReactNode
  isLoading?: boolean
}

export function PortfolioSummaryItem({
  title,
  body,
  subtext,
  subtextColor,
  sideTag,
  isLoading,
}: PortfolioSummaryItemProps) {
  return (
    <Flex
      direction="column"
      borderLeft="2px solid"
      borderColor="stroke.light"
      pl={4}
      maxW={300}
      w="100%"
      justify="space-between"
      h="100px"
    >
      <Text variant="body-14" color="element.subdued">
        {title}
      </Text>
      {!isLoading ? (
        <>
          <Flex align="center" gap={2} mt={4}>
            <Text variant="body-24" color="element.main">
              {body}
            </Text>
            {sideTag}
          </Flex>
          <Text variant="body-16" color={subtextColor || 'element.subdued'}>
            {subtext}
          </Text>
        </>
      ) : (
        <Flex direction="column" gap={2} mb={4}>
          <WonderstruckSkeleton w="60px" h="14px" />
          <WonderstruckSkeleton w="104px" h="14px" />
        </Flex>
      )}
    </Flex>
  )
}
