import { IonCard } from '@/components/shared/IonCard'
import { Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { SolanaAddressInputConnector } from './connector'

export function SolanaAddressInput({
  solanaAddress,
  solanaAddressError,
  onChangeSolanaAddress,
}: SolanaAddressInputConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <IonCard py={3} px={4} variant="outline" bg={isFocused ? 'backgroundSecondary' : 'none'} gap={2}>
      <Text>Recipient Address</Text>
      <Input
        value={solanaAddress}
        onChange={(e) => onChangeSolanaAddress(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variant="unstyled"
        size="lg"
        fontFamily="var(--font-ppformula)"
        fontSize="18px"
        letterSpacing="0.05em"
        spellCheck={false}
        placeholder="Enter Solana Address"
        color={solanaAddressError ? 'error.main' : isFocused ? 'text' : 'textSecondary'}
      />
      {solanaAddressError && <Text color="error.main">{solanaAddressError}</Text>}
    </IonCard>
  )
}

export default SolanaAddressInputConnector.Connector(SolanaAddressInput)
