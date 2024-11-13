import React from 'react'
import { FullErrorIcon } from '@/components/shared/FullErrorIcon'
import { Flex, Text, Heading, Code } from '@chakra-ui/react'

const DialogError = () => {
  return (
    <Flex flexDirection={'column'} gap={2} width={'full'} justifyContent={'center'} alignItems={'center'}>
      <FullErrorIcon />
      <Heading fontSize={'bigParagraph'} textAlign={'center'}>
        Oops! Something went wrong
      </Heading>
      {/* TODO: Better error messages from contract */}
      {/* <Text textAlign={'left'}>Error: Ops looks like something went wrong</Text> */}
      {/* <Code>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores recusandae eum quidem, voluptas reiciendis
        tenetur aut labore quos? Porro ratione eum velit ea recusandae sit laboriosam beatae unde veritatis
        necessitatibus.
      </Code> */}
    </Flex>
  )
}

export default DialogError
