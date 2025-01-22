import {
  Badge,
  Box,
  Flex,
  Icon,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Beaker02, ChevronUp } from '@untitled-ui/icons-react'

const GetStarted = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  return (
    <Popover placement="top-end">
      <PopoverTrigger>
        <Flex
          className="group"
          bg={isOpen ? 'bg.tertiary' : 'transparent'}
          display="flex"
          height={'3.5rem'}
          alignItems="center"
          paddingX="1rem"
          width="full"
          justifyContent="space-between"
          cursor={'pointer'}
          _hover={{ textDecoration: 'none', bg: 'bg.secondary' }}
          _active={{ bg: 'bg.tertiary' }}
        >
          <Flex gap={2} alignItems="center" height="full">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              h="32px"
              w="32px"
              p="16px"
              bg="bg.main"
              borderRadius="full"
            >
              <Icon as={Beaker02} strokeWidth={1} color={'element.subdued'} height={'16px'} width={'16px'} />
            </Box>
            <Flex direction="column">
              <Flex gap={1}>
                <Text fontSize={'sm'} fontWeight={'semibold'}>
                  Get Started
                </Text>
                <Badge
                  display={'flex'}
                  fontWeight={'normal'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  paddingX={'0.5rem'}
                  borderRadius={'full'}
                  bg={'bg.tertiary'}
                  color={'text.main'}
                >
                  1/3
                </Badge>
              </Flex>
              <Text fontSize={'sm'} color={'element.subdued'}>
                Explore strategies
              </Text>
            </Flex>
          </Flex>
          <Icon as={ChevronUp} strokeWidth={1} color={'element.subdued'} height={'16px'} width={'16px'} />
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        borderRadius={'8px'}
        w={'360px'}
        bg={'bg.white'}
        border={'1px solid stroke.light'}
        borderColor={'border'}
        boxShadow={'0px 4px 8px 0px rgba(0, 0, 0, 0.15)'}
        padding={'1.5rem'}
      >
        <Flex gap={1} alignItems="center">
          <Box h={'6px'} flex={1} bg={'element.subdued'} />
          <Box h={'6px'} flex={1} bg={'bg.tertiary'} />
          <Box h={'6px'} flex={1} bg={'bg.tertiary'} />
        </Flex>
        <PopoverHeader
          paddingX={0}
          paddingTop={6}
          borderBottom={'none'}
          fontSize={'xl'}
          color={'element.main'}
          fontWeight="semibold"
        >
          Welcome to Nucleus
        </PopoverHeader>
        <PopoverBody p={0}>
          <Text fontSize={'md'} color={'element.subdued'}>
            Gain access to the highest yield possible by following these quick steps:
          </Text>
          <List spacing={3} pt={6}>
            <ListItem>Mint a Native Nucleus Token</ListItem>
            <ListItem>Explore application strategies</ListItem>
            <ListItem>Apply tokens in portfolio</ListItem>
          </List>
        </PopoverBody>
        <Text fontSize={'sm'} color={'element.subdued'}>
          I know what I’m doing
        </Text>
      </PopoverContent>
    </Popover>
  )
}

export default GetStarted
