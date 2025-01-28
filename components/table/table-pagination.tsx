import { Flex, HStack, Icon, IconButton, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from '@untitled-ui/icons-react'

interface PaginationProps {
  currentPage: number
  pageSize: number
  pageIndex: number
  pageItems: string
  totalItems: string
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

export function Pagination({
  pageSize,
  pageIndex,
  currentPage,
  pageItems,
  totalItems,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPreviousPage,
  onNextPage,
}: PaginationProps) {
  return (
    <Flex justify="space-between" align="center" w="full" p={4} borderTop="1px" borderColor="stroke.main">
      <HStack spacing={3}>
        <Text fontSize="sm" color="element.main">
          {`${pageSize * pageIndex} of ${totalItems} items`}
        </Text>
      </HStack>

      <Flex alignItems="center" gap={2}>
        <Text fontSize="sm" color="element.main">
          Page {currentPage} / {totalPages}
        </Text>
        <Flex>
          <IconButton
            variant="ghost"
            aria-label="Previous page"
            icon={<Icon as={ChevronLeft} boxSize={4} />}
            size="sm"
            isDisabled={hasPreviousPage}
            onClick={onPreviousPage}
          />
          <IconButton
            variant="ghost"
            aria-label="Next page"
            icon={<Icon as={ChevronRight} boxSize={4} />}
            size="sm"
            isDisabled={hasNextPage}
            onClick={onNextPage}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
