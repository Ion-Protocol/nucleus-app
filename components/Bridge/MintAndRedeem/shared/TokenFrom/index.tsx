import { Button, Divider, Flex, Input, Skeleton, Text } from '@chakra-ui/react'
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
  loadingTokenBalance,
  tokens,
}: TokenFromConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <IonCard variant="elevate" bg={isFocused ? 'backgroundSecondary' : 'none'}>
      {/* Top Row */}
      <Flex justify="space-between">
        <Text color={error ? 'error.main' : 'text'}>Deposit</Text>
        <Flex color="secondaryText" gap={1}>
          <Text>Balance: </Text>
          <Skeleton isLoaded={!loadingTokenBalance} minW="25px">
            <Text>{tokenBalance}</Text>
          </Skeleton>
        </Flex>
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
