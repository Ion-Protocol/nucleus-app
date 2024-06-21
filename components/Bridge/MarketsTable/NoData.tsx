import { Text, Tr, Td } from '@chakra-ui/react'

export function NoData() {
  return (
    <Tr>
      <Td colSpan={4} border="none">
        <Text variant="xl" color="secondaryText" textAlign="center" mt={10}>
          No positions found
        </Text>
      </Td>
    </Tr>
  )
}
