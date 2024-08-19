import { Box, ChakraProps, Flex, Link, Text, useColorMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

interface NavItemProps extends ChakraProps {
  title: string
  href: string
  leftIcon?: ReactElement
  disabled?: boolean
  comingSoon?: boolean
}

export function NavItem({ title, href, leftIcon, disabled, comingSoon }: NavItemProps) {
  const router = useRouter()
  const isSelected = router.asPath === href
  const { colorMode } = useColorMode()

  const iconWithSize = leftIcon ? React.cloneElement(leftIcon, { height: '20px', width: '20px' }) : null

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return
    event.preventDefault()
    if (!isSelected) {
      router.push(href)
    }
  }

  return (
    <Link
      href={href}
      _hover={{ textDecoration: 'none' }}
      onClick={handleClick}
      pointerEvents={disabled ? 'none' : undefined}
      color={disabled ? 'disabled' : undefined}
    >
      <Flex
        borderRadius="8px"
        align="center"
        gap={3}
        p={2}
        cursor="pointer"
        bg={isSelected ? 'selected' : 'transparent'}
        border={isSelected ? '1px solid' : '1px solid transparent'}
        borderColor={isSelected && colorMode === 'light' ? 'border' : 'transparent'}
        _hover={{ bg: 'hover', border: '1px solid', borderColor: colorMode === 'light' ? 'border' : 'transparent' }}
        _active={{ bg: 'active' }}
      >
        <Box w="36px">{iconWithSize}</Box>
        <Text userSelect="none" variant="paragraph">
          {title} {comingSoon && '(coming soon)'}
        </Text>
      </Flex>
    </Link>
  )
}
