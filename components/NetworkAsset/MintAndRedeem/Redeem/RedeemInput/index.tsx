import { useState } from 'react'
import { Flex, Input, Text } from '@chakra-ui/react'

import { RedeemInputConnector } from './connector'

import { TokenIcon } from '@/components/config/tokenIcons'
import { IonCard } from '@/components/shared/IonCard'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { TokenKey } from '@/types/TokenKey'

const RedeemInput = ({
  networkAssetName,
  networkAssetKey,
  tokenBalance,
  error,
  inputValue,
  onChange,
}: RedeemInputConnector.Props) => {
  return (
    <IonCard variant="outline" bg="formBackground" border="1px solid" borderColor="borderLight">
      {/* Top Row */}
      <Flex justify="space-between">
        <Text>Redeem</Text>
        <Flex color="secondaryText" gap={1}>
          <Text variant="smallParagraph">Balance: </Text>
          <IonSkeleton isLoaded={true} minW="25px">
            <Text variant="smallParagraph">{tokenBalance}</Text>
          </IonSkeleton>
        </Flex>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3} mt={3}>
        {/* Input Box */}
        <Flex w="full">
          <IonSkeleton isLoaded={true} minW="250px" w="60%">
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
          </IonSkeleton>
        </Flex>

        <Flex gap={2} align="center">
          <TokenIcon fontSize="28px" tokenKey={networkAssetKey} />
          <Text variant="paragraph">{networkAssetName}</Text>
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default RedeemInputConnector.Connector(RedeemInput)
