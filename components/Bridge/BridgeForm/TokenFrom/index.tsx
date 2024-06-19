import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import TokenSelect from './TokenSelect'
import { TokenFromConnector } from './connector'
import { IonCard } from '@/components/IonCard'
import { useState } from 'react'

function TokenFrom({ inputValue, onChange }: TokenFromConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <IonCard variant="elevate" bg={isFocused ? 'selectedSecondary' : 'backgroundSecondary'}>
      {/* Top Row */}
      <Flex justify="space-between">
        <Text>From</Text>
        <Text color="secondaryText">Balance: N/A</Text>
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
        />

        {/* Max Button */}
        {/* <Button variant="outline" color="secondaryText" size="sm">
          MAX
        </Button> */}

        <Divider orientation="vertical" />

        {/* Token Select */}
        <Flex>
          <TokenSelect />
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default TokenFromConnector.Connector(TokenFrom)
