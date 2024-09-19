import { ChakraProps, Flex } from '@chakra-ui/react'

interface MultiIconProps extends ChakraProps {
  icons: React.ReactNode[]
}

export function MultiIcon({ icons, ...props }: MultiIconProps) {
  return (
    <Flex position="relative" alignItems="center" h="24px" w={`${icons.length * 25}px`} {...props}>
      {icons.map((icon, index) => (
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
  )
}
