import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import TokenSelect from '../TokenSelect'
import { TokenFromConnector } from './connector'
import { useState } from 'react'
import { IonCard } from '@/components/shared/IonCard'

function TokenFrom({
  error,
  inputValue,
  onChange,
  onChangeToken,
  onMax,
  selectedToken,
  tokenBalance,
  tokens,
}: TokenFromConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <IonCard variant="elevate" bg={isFocused ? 'selectedSecondary' : 'backgroundSecondary'}>
      {/* Top Row */}
      <Flex justify="space-between">
        <Text color={error ? 'error.main' : 'text'}>From</Text>
        <Text color="secondaryText">Balance: {tokenBalance}</Text>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3}>
        {/* Input Box */}
        <Input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="number"
          variant="unstyled"
          size="lg"
          placeholder="Amount"
          fontWeight="bold"
          color={error ? 'error.main' : 'text'}
        />
        {error && <Text color="error.main">{error}</Text>}
        <Flex gap={3} align="center">
          {/* Max Button */}
          <Button variant="outline" color="secondaryText" size="sm" onClick={onMax}>
            <Text>MAX</Text>
          </Button>

          <Divider orientation="vertical" h="36px" borderColor="border" />
          {/* Token Select */}
          <TokenSelect tokens={tokens} selected={selectedToken} onChange={onChangeToken} />
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default TokenFromConnector.Connector(TokenFrom)
