import { Button } from '@chakra-ui/react'
import { SubmitConnector } from './connector'

function Submit({ onSubmit, loading, disabled }: SubmitConnector.Props) {
  return (
    <Button
      size="lg"
      isLoading={loading}
      onClick={onSubmit}
      isDisabled={disabled}
      _hover={disabled ? {} : undefined}
      _active={disabled ? {} : undefined}
    >
      Submit
    </Button>
  )
}

export default SubmitConnector.Connector(Submit)
