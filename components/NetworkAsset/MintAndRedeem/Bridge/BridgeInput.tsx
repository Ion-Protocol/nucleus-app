import { TokenIcon } from '@/components/config/tokenIcons'
import { IonCard } from '@/components/shared/IonCard'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import { selectBridgeSourceChainKey, setBridgeAmount } from '@/store/slices/networkAssets'
import { setBridgeAmountMax } from '@/store/slices/networkAssets/thunks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function BridgeInput() {
  const dispatch = useDispatch()
  const [isFocused, setIsFocused] = useState(false)

  // Get the source chain and network asset
  const bridgeSourceChainKey = useSelector(selectBridgeSourceChainKey)
  const networkAssetFromRoute = useSelector(selectNetworkAssetFromRoute)

  // Get the token balance for the source chain
  const tokenBalance = useSelector((state: RootState) =>
    selectFormattedTokenBalance(state, bridgeSourceChainKey, networkAssetFromRoute)
  )
  const loadingTokenBalance = useSelector(selectBalancesLoading)

  // Get the input value from Redux
  const inputValue = useSelector((state: RootState) => state.networkAssets.bridgeAmount || '')

  // Get token name
  const networkAssetName = networkAssetFromRoute ? tokensConfig[networkAssetFromRoute].name : ''

  const onChange = (value: string) => {
    dispatch(setBridgeAmount(value))
  }

  const onMax = () => {
    dispatch(setBridgeAmountMax())
  }

  return (
    <IonCard variant="outline" bg={isFocused ? 'backgroundSecondary' : 'none'} pt={5}>
      {/* Top Row */}
      <Flex justify="space-between" align="center">
        <Text variant="smallParagraph">Amount</Text>
        <Flex color="secondaryText" gap={1}>
          <Text variant="smallParagraph">Balance: </Text>
          <IonSkeleton isLoaded={!loadingTokenBalance} minW="25px">
            <Text variant="smallParagraph">{tokenBalance}</Text>
          </IonSkeleton>
        </Flex>
      </Flex>

      {/* Input */}
      <Flex align="center" gap={3} mt={3} justify="space-between">
        <Flex direction="column" w="full">
          <Input
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            variant="unstyled"
            size="lg"
            fontFamily="var(--font-ppformula)"
            fontSize="18px"
            letterSpacing="0.05em"
            placeholder="0"
          />
        </Flex>
        <Flex gap={3} align="center">
          <Button variant="outline" color="secondaryText" size="sm" onClick={onMax}>
            <Text color="disabledText" variant="smallParagraph">
              MAX
            </Text>
          </Button>
          <Divider orientation="vertical" h="36px" borderColor="border" />
          <Flex gap={2} align="center">
            <TokenIcon fontSize="28px" tokenKey={networkAssetFromRoute} />
            <Text variant="paragraph">{networkAssetName}</Text>
          </Flex>
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default BridgeInput
