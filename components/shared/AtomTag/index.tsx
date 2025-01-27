import { Flex, Tag, Text, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { AtomIcon } from '../icons/Atom'

interface AtomTagProps extends PropsWithChildren {
  tooltip?: React.ReactNode
}

export function AtomTag({ children, tooltip }: AtomTagProps) {
  return (
    <Tooltip
      label={tooltip}
      bg="bg.white"
      border="1px solid"
      borderColor="stroke.main"
      borderRadius="8px"
      p={4}
      placement="top"
      w="250px"
    >
      <Tag
        borderRadius="full"
        bg="tag.rewards.bg"
        color="tag.rewards.element"
        border="1px solid"
        borderColor="tag.rewards.stroke"
        boxShadow="none"
        cursor={'pointer'}
        userSelect="none"
        _hover={{
          bg: 'linear-gradient(113deg, #FFF3C7 14.91%, #FFF6DB 40.18%, #FFF9E6 40.88%, #FFF9E5 55.61%, #FFF1BD 57.72%, #FFE78F 85.09%)',
          color: 'element.subdued',
          border: '1px solid #EDD377',
          boxShadow: '0px 0px 6px 0px rgba(237, 211, 119, 0.70)',
        }}
      >
        <Flex align="center" gap={1}>
          <AtomIcon fontSize={16} />
          <Text variant="body-16">{children}</Text>
        </Flex>
      </Tag>
    </Tooltip>
  )
}
