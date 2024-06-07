import { ArbitrumIcon } from '@/components/icons/Arbitrum'
import { BobaNetworkIcon } from '@/components/icons/BobaNetwork'
import { EdgelessIcon } from '@/components/icons/Edgeless'
import { EigenlayerPointsIcon } from '@/components/icons/EigenlayerPoints'
import { EthereumIcon } from '@/components/icons/Ethereum'
import { EthxIcon } from '@/components/icons/Ethx'
import { EzethIcon } from '@/components/icons/Ezeth'
import { IonTokenIcon } from '@/components/icons/IonToken'
import { OptimismIcon } from '@/components/icons/Optimism'
import { RsethIcon } from '@/components/icons/Rseth'
import { RswethIcon } from '@/components/icons/Rsweth'
import { StethIcon } from '@/components/icons/Steth'
import { SwellChainIcon } from '@/components/icons/SwellChain'
import { TokenEzethIcon } from '@/components/icons/TokenEzeth'
import { TokenRocketPoolIcon } from '@/components/icons/TokenRocketPool'
import { TokenRsethIcon } from '@/components/icons/TokenRseth'
import { TokenRseth1Icon } from '@/components/icons/TokenRseth1'
import { TokenSwethIcon } from '@/components/icons/TokenSweth'
import { TokenUsdIcon } from '@/components/icons/TokenUsd'
import { TokenWeethIcon } from '@/components/icons/TokenWeeth'
import { TokenWethIcon } from '@/components/icons/TokenWeth'
import { TokenWstethIcon } from '@/components/icons/TokenWsteth'
import { WstethIcon } from '@/components/icons/Wsteth'
import { Box, Button, Flex, Text, useColorMode } from '@chakra-ui/react'

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box m={10} overflowX="auto">
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
      <Flex mt={5}>
        <ArbitrumIcon fontSize="96px" /> <SwellChainIcon fontSize="96px" />
        <BobaNetworkIcon fontSize="96px" />
        <EdgelessIcon fontSize="96px" />
        <EigenlayerPointsIcon fontSize="96px" />
        <EthereumIcon fontSize="96px" />
        <EzethIcon fontSize="96px" />
        <RswethIcon fontSize="96px" />
        <StethIcon fontSize="96px" />
        <EthxIcon fontSize="96px" />
        <OptimismIcon fontSize="96px" />
        <RsethIcon fontSize="96px" />
        <TokenEzethIcon fontSize="96px" />
        <IonTokenIcon fontSize="96px" />
        <TokenRocketPoolIcon fontSize="96px" />
        <TokenRsethIcon fontSize="96px" />
        <TokenSwethIcon fontSize="96px" />
        <TokenRseth1Icon fontSize="96px" />
        <TokenUsdIcon fontSize="96px" />
        <TokenWstethIcon fontSize="96px" />
        <TokenWeethIcon fontSize="96px" />
        <TokenWethIcon fontSize="96px" />
        <WstethIcon fontSize="96px" />
      </Flex>
    </Box>
  )
}
