import { useRouter } from 'next/router'
import { Box, Text } from '@chakra-ui/react'

export default function Bridge() {
  const router = useRouter()
  const { bridge } = router.query

  return (
    <Box p={6}>
      <Text fontSize="xl">Bridge Page: {bridge}</Text>
      <Text>This is the content for the {bridge} bridge page.</Text>
    </Box>
  )
}
