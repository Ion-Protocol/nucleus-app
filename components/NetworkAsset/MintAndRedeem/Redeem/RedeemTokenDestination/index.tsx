import { useState } from 'react'
import { TokenIcon } from '@/components/config/tokenIcons'
import { IonCard } from '@/components/shared/IonCard'
import { Flex, Input, Skeleton, Text } from '@chakra-ui/react'

import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { TokenFromConnector } from './connector'

function TokenDestination({
  onChange,
  inputValue,
  networkAssetKey,
  networkAssetName,
  tokenBalance,
  loadingTokenBalance,
  loadingTokenRate,
}: TokenFromConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <IonCard variant="outline" bg="formBackground" border="1px solid" borderColor="borderLight">
      {/* Top Row */}
      <Flex justify="space-between">
        <Text>Redeem</Text>
        <Flex color="secondaryText" gap={1}>
          <Text variant="smallParagraph">Balance: </Text>
          <IonSkeleton isLoaded={!loadingTokenBalance} minW="25px">
            <Text variant="smallParagraph">{tokenBalance}</Text>
          </IonSkeleton>
        </Flex>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3} mt={3}>
        {/* Input Box */}
        <Flex w="full">
          <IonSkeleton isLoaded={!loadingTokenRate} minW="250px" w="60%">
            <Input
              color="textSecondary"
              fontFamily="var(--font-ppformula)"
              fontSize="18px"
              letterSpacing="0.05em"
              placeholder="0"
              size="lg"
              value={inputValue}
              variant="unstyled"
              onBlur={() => setIsFocused(false)}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
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

export default TokenFromConnector.Connector(TokenDestination)
