import { Box, Text } from '@chakra-ui/react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Box fontSize="24px" m={10}>
      <Text>the quick brown fox jumped over the lazy dog</Text>
      <Text>THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG</Text>
    </Box>
  )
}
