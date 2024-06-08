import { Box, Button, Text } from '@chakra-ui/react'
import { TestComponentConnector } from './connector'

function TestComponent({ count, increment }: TestComponentConnector.Props) {
  return (
    <Box>
      <Button onClick={() => increment()}>Increment</Button>
      <Text>{count}</Text>
    </Box>
  )
}

export default TestComponentConnector.Connector(TestComponent)
