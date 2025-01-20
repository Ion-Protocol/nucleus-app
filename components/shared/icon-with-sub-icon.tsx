import { Flex } from '@chakra-ui/react'
import React from 'react'

interface IconWithSubIconProps {
  icon: React.ReactElement
  subIcon: React.ReactElement
}

export function IconWithSubIcon({ icon, subIcon }: IconWithSubIconProps) {
  return (
    <Flex position="relative">
      {React.cloneElement(icon)}
      <Flex position="absolute" top={0} right="-8px">
        {/* {React.cloneElement(subIcon, {
          fontSize: '24px',
          border: '1px solid red',
          borderRadius: '8px',
          borderColor: 'stroke.light',
        })} */}
      </Flex>
    </Flex>
  )
}
