import { Flex, Icon, IconButton, Select, Text } from '@chakra-ui/react'
import { SwitchHorizontal01 } from '@untitled-ui/icons-react'

function BridgeSelect() {
  return (
    <Flex alignItems={'flex-end'} gap={2}>
      <Flex flexDirection="column" gap={1} w="100%">
        <Text as={'label'} htmlFor="from" variant="paragraph">
          From
        </Text>
        <Select id="from">
          <option value="1">1</option>
          <option value="2">2</option>
        </Select>
      </Flex>
      <IconButton variant={'ghost'} aria-label="Swap" icon={<Icon as={SwitchHorizontal01} fontSize={'20px'} />} />
      <Flex flexDirection="column" gap={1} w="100%">
        <Text as={'label'} htmlFor="to" variant="paragraph">
          To
        </Text>
        <Select id="to">
          <option value="1">1</option>
          <option value="2">2</option>
        </Select>
      </Flex>
    </Flex>
  )
}

export default BridgeSelect
