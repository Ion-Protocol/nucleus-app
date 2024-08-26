import { Button, Divider, Flex, Input, Skeleton, Text } from '@chakra-ui/react'
import TokenSelect from '../TokenSelect'
import { TokenInputConnector } from './connector'
import { useState } from 'react'
import { IonCard } from '@/components/shared/IonCard'

function TokenInput({
  error,
  inputValue,
  onChange,
  onChangeToken,
  onMax,
  selectedToken,
  tokenBalance,
  loadingTokenBalance,
  tokens,
  shouldShowMax,
}: TokenInputConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <IonCard variant="outline" bg={isFocused ? 'backgroundSecondary' : 'none'}>
      {/* Top Row */}
      <Flex justify="space-between">
        <Text variant="smallParagraph" color={error ? 'error.main' : 'text'}>
          Amount
        </Text>

        <Flex color="secondaryText" gap={1}>
          <Text variant="smallParagraph">Balance: </Text>
          <Skeleton isLoaded={!loadingTokenBalance} minW="25px">
            <Text>{tokenBalance}</Text>
          </Skeleton>
        </Flex>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3} mt={3}>
        {/* Input Box */}
        <Input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="number"
          variant="unstyled"
          size="lg"
          fontFamily="var(--font-ppformula)"
          fontSize="18px"
          letterSpacing="0.05em"
          placeholder="0"
          color={error ? 'error.main' : 'text'}
        />
        {error && <Text color="error.main">{error}</Text>}
        <Flex gap={3} align="center">
          {/* Max Button */}
          {shouldShowMax && (
            <Flex gap={3}>
              <Button variant="outline" color="secondaryText" size="sm" onClick={onMax}>
                <Text color="disabledText" variant="smallParagraph">
                  MAX
                </Text>
              </Button>
              <Divider orientation="vertical" h="36px" borderColor="border" />
            </Flex>
          )}

          {/* Token Select */}
          <TokenSelect tokens={tokens} selected={selectedToken} onChange={onChangeToken} />
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default TokenInputConnector.Connector(TokenInput)
