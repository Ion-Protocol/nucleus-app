import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { SubmitConnector } from './connector'

function Deposit({ onSubmit, loading, disabled }: SubmitConnector.Props) {
  return (
    <ConnectAwareButton
      h="fit-content"
      p={2}
      isLoading={loading}
      onClick={onSubmit}
      isDisabled={disabled}
      _hover={disabled || loading ? {} : undefined}
      _active={disabled || loading ? {} : undefined}
    >
      Mint
    </ConnectAwareButton>
  )
}

export default SubmitConnector.Connector(Deposit)
