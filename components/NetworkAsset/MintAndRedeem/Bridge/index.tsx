import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { ChakraProps, Flex, Text } from '@chakra-ui/react'
import BridgeInput from './BridgeInput'
import BridgeSelect from './BridgeSelect'

export function Bridge({ ...props }: ChakraProps) {
  return (
    <Flex direction="column" {...props} gap={6}>
      <BridgeSelect />
      <BridgeInput />

      <ConnectAwareButton
        h="fit-content"
        p={2}
        gap={1}
        // isLoading={loading}
        // onClick={handleClickSubmit}
        // isDisabled={disabled}
        // _hover={!loading && !disabled ? {} : undefined}
        // _active={!loading && !disabled ? {} : undefined}
      >
        <Text variant="button">Bridge</Text>
      </ConnectAwareButton>
    </Flex>
  )
}
