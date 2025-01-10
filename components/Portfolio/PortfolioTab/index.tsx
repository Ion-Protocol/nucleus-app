import { Flex, Tab, TabProps, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface PortfolioTabProps extends TabProps {
  isSelected: boolean
  onClick: () => void
  icon?: ReactNode
}

export function PortfolioTab({ isSelected, children, onClick, icon, ...props }: PortfolioTabProps) {
  return (
    <Tab bg={isSelected ? 'bg.secondary' : 'transparent'} borderRadius={8} {...props} onClick={onClick}>
      <Flex alignItems="center" gap={2}>
        {icon}
        <Text variant="body-14" color={isSelected ? 'element.lighter' : 'element.subdued'}>
          {children}
        </Text>
      </Flex>
    </Tab>
  )
}
