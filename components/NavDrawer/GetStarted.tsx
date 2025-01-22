import {
  Badge,
  Box,
  Flex,
  Icon,
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
      <PopoverContent>
        <PopoverHeader borderBottom={'none'} fontWeight="semibold">
          Welcome to Nucleus
        </PopoverHeader>
        <PopoverBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
          dolore.
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default GetStarted
