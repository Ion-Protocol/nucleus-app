import { Skeleton, SkeletonProps } from '@chakra-ui/react'

export function WonderstruckSkeleton({ ...props }: SkeletonProps) {
  return (
    <Skeleton borderRadius="8px" startColor="element.invert.secondary" endColor="element.invert.primary" {...props} />
  )
}
