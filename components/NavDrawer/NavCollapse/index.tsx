import { Box, Collapse, Flex, Text } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import React from 'react'
import { NavCollapseConnector } from './connector'

function NavCollapse({ title, leftIcon, children, isOpen, toggle }: NavCollapseConnector.Props) {
  const iconWithSize = leftIcon ? React.cloneElement(leftIcon, { height: '20px', width: '20px' }) : null

  const handleClick = () => {
    toggle()
  }

  return (
    <Box>
      <Box _hover={{ textDecoration: 'none' }} onClick={handleClick} cursor="pointer">
        <Flex
          borderRadius="8px"
          align="center"
          p={2}
          cursor="pointer"
          _hover={{ bg: 'hover' }}
          _active={{ bg: 'active' }}
          justify="space-between"
        >
          <Flex gap={3}>
            <Box w="36px">{iconWithSize}</Box>
            <Text userSelect="none">{title}</Text>
          </Flex>
          {isOpen && <ChevronUpIcon />}
          {!isOpen && <ChevronDownIcon />}
        </Flex>
      </Box>
      <Collapse in={isOpen} animateOpacity unmountOnExit>
        <Flex direction="column">{children}</Flex>
      </Collapse>
    </Box>
  )
}

export default NavCollapseConnector.Connector(NavCollapse)
