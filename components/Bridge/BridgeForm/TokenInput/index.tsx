import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import { TokenInputConnector } from './connector'
import { useState } from 'react'
import TokenSelect from './TokenSelect'

function TokenInput({ role, inputValue, onChange }: TokenInputConnector.Props) {
  const [displayValue, setDisplayValue] = useState(inputValue)

  const handleBlur = () => {
    if (inputValue) {
      const formattedValue = parseFloat(inputValue).toLocaleString('en-US', {
        maximumFractionDigits: 18,
      })
      setDisplayValue(formattedValue)
    }
  }

  const handleFocus = () => {
    setDisplayValue(inputValue)
  }

  const handleChange = (value: string) => {
    const rawValue = value.replace(/,/g, '')

    if (/^\d*\.?\d*$/.test(rawValue)) {
      onChange(rawValue)
      setDisplayValue(value)
    }
  }

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="border"
      borderRadius="8px"
      p={4}
      bg="backgroundSecondary"
      gap={4}
    >
      {/* Top Row */}
      <Flex justify="space-between">
        <Text fontSize="sm">{role === 'from' ? 'From' : 'To'}</Text>
        <Text fontSize="sm" color="secondaryText">
          Balance: 35.422 ETH
        </Text>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3}>
        {/* Input Box */}
        <Input
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          variant="unstyled"
          size="lg"
          placeholder="Amount"
          fontWeight="bold"
        />

        {/* Max Button */}
        <Button variant="outline" color="secondaryText" size="sm">
          MAX
        </Button>

        <Divider orientation="vertical" />

        {/* Token Select */}
        <Flex>
          <TokenSelect />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TokenInputConnector.Connector(TokenInput)
