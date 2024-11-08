import React from 'react'
import { FullErrorIcon } from '@/components/shared/FullErrorIcon'
import { Flex, Text, Heading, Code } from '@chakra-ui/react'

const DialogError = () => {
  return (
    <Flex flexDirection={'column'} gap={2} width={'full'} justifyContent={'center'} alignItems={'center'}>
      <FullErrorIcon />
      <Heading fontSize={'bigParagraph'} textAlign={'center'}>
        Ops! Something went wrong
      </Heading>
      <Text textAlign={'left'}>Error: User rejected the request</Text>
      <Code>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores recusandae eum quidem, voluptas reiciendis
        tenetur aut labore quos? Porro ratione eum velit ea recusandae sit laboriosam beatae unde veritatis
        necessitatibus.
      </Code>
    </Flex>
  )
}

export default DialogError
