import { ChakraProps, Flex } from '@chakra-ui/react'

interface DoubleIconProps extends ChakraProps {
  icons: [React.ReactNode, React.ReactNode]
}

export function DoubleIcon({ icons, ...props }: DoubleIconProps) {
  return (
    <Flex position="relative" alignItems="center" w="40px" {...props}>
      <Flex
        position="absolute"
        left="15px"
        bg="white"
        borderRadius="100px"
        p="2px"
        border="2px solid"
        borderColor="border"
      >
        {icons[1]}
      </Flex>
      <Flex
        position="absolute"
        left="0px"
        bg="white"
        borderRadius="100px"
        p="2px"
        border="2px solid"
        borderColor="border"
      >
        {icons[0]}
      </Flex>
    </Flex>
  )
}
