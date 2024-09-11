import { IonCard } from '@/components/shared/IonCard'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import TokenSelect from '../TokenSelect'
import { TokenInputConnector } from './connector'
import { IonTooltip } from '@/components/shared/IonTooltip'

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
  shouldIgnoreBalance,
}: TokenInputConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <IonCard variant="outline" bg={isFocused ? 'backgroundSecondary' : 'none'} pt={shouldIgnoreBalance ? 3 : 5}>
      {/* Top Row */}
      <Flex justify="space-between" align="center">
        {shouldIgnoreBalance ? (
          <Flex
            border="1px solid"
            borderColor="borderLight"
            borderRadius="4px"
            gap={2}
            align="center"
            py={1}
            px={2}
            bg="backgroundAlternate"
          >
            <Text>You may input any amount here</Text>
            <IonTooltip label="Upon pressing mint, choose an asset that you want to spend from your crosschain wallet balances">
              <InfoOutlineIcon color="infoIcon" fontSize="13px" />
            </IonTooltip>
          </Flex>
        ) : (
          <Text variant="smallParagraph" color={error ? 'error.main' : 'text'}>
            Amount
          </Text>
        )}

        <Flex color="secondaryText" gap={1}>
          <>
            <Text variant="smallParagraph">Balance: </Text>
            <IonSkeleton isLoaded={!loadingTokenBalance} minW="25px">
              <Text>{tokenBalance}</Text>
            </IonSkeleton>
          </>
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
          {!shouldIgnoreBalance && (
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
