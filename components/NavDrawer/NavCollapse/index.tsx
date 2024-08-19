import { Box, Collapse, Flex, Text, useColorMode } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import React from 'react'
import { NavCollapseConnector } from './connector'

function NavCollapse({ title, leftIcon, children, isOpen, toggle }: NavCollapseConnector.Props) {
  const iconWithSize = leftIcon ? React.cloneElement(leftIcon, { height: '20px', width: '20px' }) : null
  const { colorMode } = useColorMode()

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
          border="1px solid"
          borderColor="transparent"
          _hover={{ bg: 'hover', border: '1px solid', borderColor: colorMode === 'light' ? 'border' : 'transparent' }}
          _active={{ bg: 'active' }}
          justify="space-between"
        >
          <Flex gap={3}>
            <Box w="36px">{iconWithSize}</Box>
            <Text userSelect="none" variant="large">
              {title}
            </Text>
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
