import { Box, ChakraProps, ComponentWithAs, Flex, Icon, IconProps, Link, Text, useColorMode } from '@chakra-ui/react'
import { LucideIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React from 'react'

interface NavItemProps extends ChakraProps {
  title: string
  href: string
  leftIcon: ComponentWithAs<'svg', IconProps> | LucideIcon
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
  const isActive = router.asPath === href
  const { colorMode } = useColorMode()

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return
    event.preventDefault()
    if (isExternal) {
      window.open(partnerUrl, '_blank')
      return
    }
    if (!isActive) {
      router.push(href)
    }
  }

  return (
    <Link
      display="flex"
      gap={8}
      height={'3.5rem'}
      alignItems="center"
      onClick={handleClick}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      color={disabled ? 'disabledText' : undefined}
      _hover={{ textDecoration: 'none', bg: 'bg.secondary' }}
      {...props}
    >
      <Flex
        align="center"
        paddingX="1rem"
        width="full"
        gap={2}
        // bg={isActive ? 'navDrawerSelected' : 'transparent'}
        // border={isActive ? '1px solid' : '1px solid transparent'}
        // borderColor={isActive && colorMode === 'light' ? 'border' : 'transparent'}
        // _hover={{
        //   bg: disabled ? 'transparent' : 'hover',
        //   border: '1px solid',
        //   borderColor: colorMode === 'light' ? 'border' : 'transparent',
        // }}
        // _active={{ bg: disabled ? 'transparent' : 'active' }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="32px"
          w="32px"
          p="16px"
          bg="bg.active"
          borderRadius="full"
          border="solid 1px"
          borderColor="stroke.darker"
        >
          <Icon height={'16px'} width={'16px'} as={leftIcon} />
        </Box>
        {/* marginTop of 4px is to compensate for some strange font offset */}
        <Text userSelect="none" variant="paragraph" mt="4px">
          {title} {comingSoon && '(coming soon)'}
        </Text>
      </Flex>
    </Link>
  )
}
