import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { useConnectModal, useFunkitCheckout } from '@funkit/connect'
import { SubmitConnector } from './connector'

function Deposit({ onSubmit, loading, disabled }: SubmitConnector.Props) {
  const { openConnectModal } = useConnectModal()
  const { beginCheckout } = useFunkitCheckout({
    onLoginRequired: openConnectModal,
  })

  function handleClickSubmit() {
    onSubmit(beginCheckout)
  }

  return (
    <ConnectAwareButton
      h="fit-content"
      p={2}
      isLoading={loading}
      onClick={handleClickSubmit}
      isDisabled={disabled}
      _hover={!loading && !disabled ? {} : undefined}
      _active={!loading && !disabled ? {} : undefined}
    >
      Mint
    </ConnectAwareButton>
  )
}

export default SubmitConnector.Connector(Deposit)
