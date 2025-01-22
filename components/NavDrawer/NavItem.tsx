import { Box, ChakraProps, ComponentWithAs, Flex, Icon, IconProps, Link, Text } from '@chakra-ui/react'
import { ArrowUpRight, Eye } from '@untitled-ui/icons-react'
import { useRouter } from 'next/router'
import React, { ElementType } from 'react'

interface NavItemProps extends ChakraProps {
  title: string
  href?: string
  leftIcon: ComponentWithAs<'svg', IconProps> | ElementType
  disabled?: boolean
  comingSoon?: boolean
  isExternal?: boolean
  partnerUrl?: string
  onClick?: () => void
}

export function NavItem({
  title,
  href,
  leftIcon,
  disabled,
  comingSoon,
  isExternal,
  partnerUrl,
  onClick,
  ...props
}: NavItemProps) {
  const router = useRouter()
  const isSelected = router.asPath === href

  const handleClick = (event: React.MouseEvent) => {
    if (isExternal) {
      window.open(href, '_blank')
      return
    }
    if (onClick) {
      onClick()
      return
    }
    if (disabled) return
    event.preventDefault()
    if (!isSelected && href) {
      router.push(href)
    }
  }

  return (
    <Link
      className="group"
      bg={isSelected ? 'bg.tertiary' : 'transparent'}
      display="flex"
      height={'3.5rem'}
      alignItems="center"
      paddingX="1rem"
      width="full"
      justifyContent="space-between"
      onClick={handleClick}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      color={disabled ? 'disabledText' : undefined}
      _hover={{ textDecoration: 'none', bg: 'bg.secondary' }}
      _active={{ bg: 'bg.tertiary' }}
      {...props}
    >
      <Flex gap={2} alignItems="center" height="full">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="32px"
          w="32px"
          p="16px"
          bg="bg.main"
          borderRadius="full"
          border={isSelected ? 'solid 1px' : 'none'}
          borderColor={isSelected ? 'stroke.darker' : 'stroke.main'}
          _groupHover={{ bg: 'bg.main', border: 'solid 1px', borderColor: 'stroke.main' }}
          _groupActive={{ bg: 'bg.main', border: 'solid 1px', borderColor: 'stroke.darker' }}
        >
          <Icon
            as={leftIcon}
            strokeWidth={1}
            color={isSelected ? 'element.main' : 'element.subdued'}
            _groupActive={{ color: 'element.main' }}
            height={'16px'}
            width={'16px'}
          />
        </Box>
        <Text userSelect="none" variant="paragraph" _groupActive={{ color: 'element.main' }}>
          {title} {comingSoon && '(coming soon)'}
        </Text>
      </Flex>
      {isSelected && <Icon as={Eye} color="element.subdued" justifySelf="end" />}
      {isExternal && <Icon as={ArrowUpRight} color="element.subdued" justifySelf="end" />}
    </Link>
  )
}
