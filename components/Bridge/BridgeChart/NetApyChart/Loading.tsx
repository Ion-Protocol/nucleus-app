import { Text, Flex, Spinner } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionFlex = motion(Flex)

export function Loading() {
  return (
    <Flex position="absolute" h="100%" align="center" justify="center" w="100%">
      <MotionFlex
        bg="background"
        px={12}
        py={3}
        borderRadius="8px"
        align="center"
        h="fit-content"
        gap={3}
        direction="column"
        border="1px solid"
        borderColor="border"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.75 }}
        transition={{ duration: 0.35 }}
        zIndex={4}
      >
        <Spinner thickness="2px" speed="0.75s" color="primary.500" size="lg" />
        <Text fontWeight="bold" color="secondaryText">
          Loading Data...
        </Text>
      </MotionFlex>
    </Flex>
  )
}
