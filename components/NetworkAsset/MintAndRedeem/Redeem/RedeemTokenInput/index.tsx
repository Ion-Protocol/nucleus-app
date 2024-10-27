import { IonCard } from '@/components/shared/IonCard'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { RedeemTokenInputConnector } from './connector'
import { IonTooltip } from '@/components/shared/IonTooltip'
import TokenSelect from '../../shared/TokenSelect'

function RedeemTokenInput({
  error,
  inputValue,
  onChangeToken,
  onMax,
  selectedToken,
  tokenBalance,
  loadingTokenBalance,
  tokens,
  shouldIgnoreBalance,
}: RedeemTokenInputConnector.Props) {
  return (
    <IonCard variant="outline" bg={'backgroundSecondary'} pt={shouldIgnoreBalance ? 3 : 5}>
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
            <Text>Try inputting any amount!</Text>
            <IonTooltip label="If you do not have one of the default supported assets, input any amount and Nucleus will allow you to deposit other assets or use fiat onramps">
              <InfoOutlineIcon color="infoIcon" fontSize="13px" />
            </IonTooltip>
          </Flex>
        ) : (
          <Text variant="smallParagraph" color={error ? 'error.main' : 'text'}>
            Receive
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
      <Flex align="center" gap={3} mt={3} justify="space-between">
        {/* Input Box */}
        <Flex direction="column">
          <Input
            color="textSecondary"
            cursor="pointer"
            disabled
            _disabled={{
              cursor: 'text',
              color: 'disabled',
            }}
            fontFamily="var(--font-ppformula)"
            fontSize="18px"
            letterSpacing="0.05em"
            placeholder="0"
            size="lg"
            value={inputValue}
            variant="unstyled"
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
          </Flex>

          {/* Token Select */}
          <TokenSelect tokens={tokens} selected={selectedToken} onChange={onChangeToken} />
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default RedeemTokenInputConnector.Connector(RedeemTokenInput)
