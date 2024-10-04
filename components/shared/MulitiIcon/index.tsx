import { ChakraProps, Flex, Text } from '@chakra-ui/react'

interface MultiIconProps extends ChakraProps {
  icons: React.ReactNode[]
  max?: number
}

export function MultiIcon({ icons, max = 4, ...props }: MultiIconProps) {
  return (
    <Flex align="center">
      <Flex position="relative" alignItems="center" h="24px" w={`${Math.min(icons.length, max) * 24}px`} {...props}>
        {icons.slice(0, max).map((icon, index) => (
          <Flex
            key={index}
            position="absolute"
            top="0"
            left={`${index * 20}px`}
            bg="iconBackground"
            p="4px"
            borderRadius="100px"
            border="1px solid"
            borderColor="borderLight"
          >
            {icon}
          </Flex>
        ))}
      </Flex>
      {icons.length > max && (
        <Flex bg="smallTag" borderRadius="3px" px={1} mt="2px">
          <Text variant="smallTag" mt="4px" color="smallTagText">
            {`+${icons.length - max}`}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
