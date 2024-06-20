import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Text, Th, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface IonThProps extends PropsWithChildren {
  tooltip?: string
}

export function IonTh({ tooltip, children }: IonThProps) {
  return (
    <Th sx={{ textTransform: 'none' }} borderBottomColor="border">
      <Flex gap={2}>
        <Text variant="large" fontWeight="normal" color="text">
          {children}
        </Text>
        <Tooltip label={tooltip}>
          <InfoOutlineIcon />
        </Tooltip>
      </Flex>
    </Th>
  )
}
