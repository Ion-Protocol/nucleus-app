import { Tr, Td, Skeleton } from '@chakra-ui/react'

export function Loading() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Tr key={index}>
          <Td>
            <Skeleton height="20px" />
          </Td>
          <Td>
            <Skeleton height="20px" />
          </Td>
          <Td>
            <Skeleton height="20px" />
          </Td>
          <Td>
            <Skeleton height="20px" />
          </Td>
        </Tr>
      ))}
    </>
  )
}
