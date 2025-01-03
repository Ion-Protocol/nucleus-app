import { Flex, HStack, IconButton, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  pageSize?: number
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
    <Flex justify="space-between" align="center" w="full" p={4} borderTop="1px" borderColor="gray.200">
      <HStack spacing={3}>
        <Text fontSize="sm" color="gray.600">
          {`Showing ${pageItems} of ${totalItems} items`}
        </Text>
      </HStack>

      <HStack spacing={1}>
        <Text fontSize="sm" color="gray.600">
          Page {currentPage} / {totalPages}
        </Text>
        <IconButton
          variant="ghost"
          aria-label="Previous page"
          icon={<ChevronLeft size={16} />}
          size="sm"
          isDisabled={hasPreviousPage}
          onClick={onPreviousPage}
        />
        <IconButton
          variant="ghost"
          aria-label="Next page"
          icon={<ChevronRight size={16} />}
          size="sm"
          isDisabled={hasNextPage}
          onClick={onNextPage}
        />
      </HStack>
    </Flex>
  )
}
