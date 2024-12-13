import { Button, Flex, HStack, IconButton, Select, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <Flex justify="space-between" align="center" w="full" p={4} borderTop="1px" borderColor="gray.200">
      <HStack spacing={3}>
        <Text fontSize="sm" color="gray.600">
          Show
        </Text>
        <Select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} size="sm" w="70px">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
        <Text fontSize="sm" color="gray.600">
          Showing {startItem} to {endItem} of {totalItems} entries
        </Text>
      </HStack>

      <HStack spacing={2}>
        <IconButton
          aria-label="Previous page"
          icon={<ChevronLeft size={18} />}
          size="sm"
          isDisabled={!hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? 'solid' : 'ghost'}
            colorScheme={currentPage === page ? 'blue' : 'gray'}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        <IconButton
          aria-label="Next page"
          icon={<ChevronRight size={18} />}
          size="sm"
          isDisabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </HStack>
    </Flex>
  )
}
