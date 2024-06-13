import { Button } from '@chakra-ui/react'
import { SubmitConnector } from './connector'

function Submit({ onSubmit, loading, disabled }: SubmitConnector.Props) {
  return (
    <Button
      size="lg"
      isLoading={loading}
      onClick={onSubmit}
      isDisabled={disabled}
      _hover={disabled || loading ? {} : undefined}
      _active={disabled || loading ? {} : undefined}
    >
      Submit
    </Button>
  )
}

export default SubmitConnector.Connector(Submit)
