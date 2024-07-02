import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { Td, Tr } from '@chakra-ui/react'

export function Loading() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Tr key={index}>
          <Td>
            <IonSkeleton height="20px" />
          </Td>
          <Td>
            <IonSkeleton height="20px" />
          </Td>
          <Td>
            <IonSkeleton height="20px" />
          </Td>
          <Td>
            <IonSkeleton height="20px" />
          </Td>
        </Tr>
      ))}
    </>
  )
}
