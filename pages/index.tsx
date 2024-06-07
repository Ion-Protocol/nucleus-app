import { ArbitrumIcon } from '@/components/icons/Arbitrum'
import { SwellChainIcon } from '@/components/icons/SwellChain'
import { Box, Button, Text, useColorMode } from '@chakra-ui/react'

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box m={10}>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
      <Text fontSize="16px" color="border.primary">
        the quick brown fox jumped over the lazy dog
      </Text>
      <Text textStyle="header2">
        THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG
      </Text>
      <Text textStyle="header1" color="warning.main" mt={3}>
        $277,308.00
      </Text>
      <ArbitrumIcon fontSize="128px" />
      <SwellChainIcon fontSize="128px" />
    </Box>
  )
}
