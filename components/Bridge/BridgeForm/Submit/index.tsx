import { Button } from '@chakra-ui/react'
import { SubmitConnector } from './connector'

function Submit({ onSubmit, loading }: SubmitConnector.Props) {
  return (
    <Button size="lg" isLoading={loading} onClick={onSubmit}>
      Submit
    </Button>
  )
}

export default SubmitConnector.Connector(Submit)
