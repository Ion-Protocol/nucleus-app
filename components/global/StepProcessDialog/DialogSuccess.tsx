import { Flex, Heading, Text, useColorMode } from '@chakra-ui/react'
// import { Image } from '@chakra-ui/next-js'
import Image from 'next/image'

const DialogSuccess = () => {
  const { colorMode } = useColorMode()
  return (
    <Flex flexDirection={'column'} gap={2} width={'full'} justifyContent={'center'} alignItems={'center'}>
      <Image
        alt="redeem success nucleus"
        width={180}
        height={180}
        priority={true}
        src={colorMode === 'light' ? '/assets/images/mint-success-light.webp' : '/assets/images/mint-success-dark.webp'}
      />
      <Heading fontSize={'22px'} fontWeight={400} textAlign={'center'} maxWidth={'18rem'}>
        Your withdraw request has been successfully received.
      </Heading>
      <Text fontSize={'12px'} fontWeight={400} textAlign={'center'} w={'70%'} maxWidth={'18rem'}>
        Once the request is processed, the assets will be automatically credited to your account.
      </Text>
    </Flex>
  )
}

export default DialogSuccess
