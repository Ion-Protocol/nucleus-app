import React from 'react'
import { FullErrorIcon } from '@/components/shared/FullErrorIcon'
import { Flex, Text, Heading, Code, useColorMode } from '@chakra-ui/react'
import Image from 'next/image'

const DialogError = () => {
  const { colorMode } = useColorMode()
  return (
    <Flex
      flexDirection={'column'}
      paddingBottom={2}
      gap={4}
      width={'full'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Image
        alt="redeem success nucleus"
        width={180}
        height={180}
        src={
          colorMode === 'light' ? '/assets/images/nucleus-error-light.webp' : '/assets/images/nucleus-error-dark.webp'
        }
      />
      <Flex>
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
    </Flex>
  )
}

export default DialogError
