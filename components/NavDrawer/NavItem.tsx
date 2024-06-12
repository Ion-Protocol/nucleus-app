import { useAppDispatch } from '@/store/hooks'
import { setBridgeNavOpen } from '@/store/slices/ui'
import { Box, ChakraProps, Flex, Link, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'

interface NavItemProps extends ChakraProps {
  title: string
  href: string
  leftIcon?: ReactElement
  disabled?: boolean
}

export function NavItem({ title, href, leftIcon, disabled }: NavItemProps) {
  const router = useRouter()
  const isSelected = router.asPath === href

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
        _hover={{ bg: 'hover' }}
        _active={{ bg: 'active' }}
      >
        <Box w="36px">{iconWithSize}</Box>
        <Text userSelect="none">{title}</Text>
      </Flex>
    </Link>
  )
}
