import { TokenIcon } from '@/components/config/tokenIcons'
import { IonCard } from '@/components/shared/IonCard'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { RootState } from '@/store'
import { selectNetworkAssetConfig } from '@/store/slices/networkAssets'
import { TokenKey } from '@/types/TokenKey'
import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
function BridgeInput() {
  const networkAssetConfig = useSelector((state: RootState) => selectNetworkAssetConfig(state))
  console.log(networkAssetConfig)
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [loadingTokenBalance, setLoadingTokenBalance] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [error, setError] = useState('')

  const onChange = (value: string) => {
    setInputValue(value)
  }

  const onMax = () => {
    setInputValue('')
    setError('')
  }

  return (
    <IonCard variant="outline" bg={isFocused ? 'backgroundSecondary' : 'none'} pt={5}>
      {/* Top Row */}
      <Flex justify="space-between" align="center">
        <Text variant="smallParagraph" color={error ? 'error.main' : 'text'}>
          Amount
        </Text>

        <Flex color="secondaryText" gap={1}>
          <>
            <Text variant="smallParagraph">Balance: </Text>
            <IonSkeleton isLoaded={!loadingTokenBalance} minW="25px">
              <Text>{tokenBalance}</Text>
            </IonSkeleton>
          </>
        </Flex>
      </Flex>

      {/* Input */}
      <Flex align="center" gap={3} mt={3} justify="space-between">
        {/* Input Box */}
        <Flex direction="column">
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
            color={error ? 'error.main' : 'text'}
          />
          {error && <Text color="error.main">{error}</Text>}
        </Flex>
        <Flex gap={3} align="center">
          {/* Max Button */}
          <Flex gap={3}>
            <Button variant="outline" color="secondaryText" size="sm" onClick={onMax}>
              <Text color="disabledText" variant="smallParagraph">
                MAX
              </Text>
            </Button>
            <Divider orientation="vertical" h="36px" borderColor="border" />
            <Flex gap={2} align="center">
              <TokenIcon fontSize="28px" tokenKey={TokenKey.FETH} />
              <Text variant="paragraph">FETH</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default BridgeInput
