import { Box, ChakraProps, Flex, Link, Text, useColorMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

interface NavItemProps extends ChakraProps {
  title: string
  href: string
  leftIcon?: ReactElement
  disabled?: boolean
  comingSoon?: boolean
  isExternal?: boolean
  partnerUrl?: string
}

export function NavItem({
  title,
  href,
  leftIcon,
  disabled,
  comingSoon,
  isExternal,
  partnerUrl,
  ...props
}: NavItemProps) {
  const router = useRouter()
  const isSelected = router.asPath === href
  const { colorMode } = useColorMode()

  const iconWithSize = leftIcon ? React.cloneElement(leftIcon, { height: '20px', width: '20px' }) : null

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return
    event.preventDefault()
    if (isExternal) {
      window.open(partnerUrl, '_blank')
      return
    }
    if (!isSelected) {
      router.push(href)
    }
  }

  return (
    <Link
      _hover={{ textDecoration: 'none' }}
      onClick={handleClick}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      color={disabled ? 'disabledText' : undefined}
      {...props}
    >
      <Flex
        borderRadius="8px"
        align="center"
        gap={3}
        p={2}
        bg={isSelected ? 'navDrawerSelected' : 'transparent'}
        border={isSelected ? '1px solid' : '1px solid transparent'}
        borderColor={isSelected && colorMode === 'light' ? 'border' : 'transparent'}
        _hover={{
          bg: disabled ? 'transparent' : 'hover',
          border: '1px solid',
          borderColor: colorMode === 'light' ? 'border' : 'transparent',
        }}
        _active={{ bg: disabled ? 'transparent' : 'active' }}
      >
        <Box w="36px">{iconWithSize}</Box>
        {/* marginTop of 4px is to compensate for some strange font offset */}
        <Text userSelect="none" variant="paragraph" mt="4px">
          {title} {comingSoon && '(coming soon)'}
        </Text>
      </Flex>
    </Link>
  )
}
