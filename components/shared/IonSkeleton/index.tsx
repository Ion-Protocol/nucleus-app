import { Skeleton, SkeletonProps } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface IonSkeletonProps extends SkeletonProps, PropsWithChildren {}

export function IonSkeleton({ children, ...props }: IonSkeletonProps) {
  return (
    <Skeleton startColor="skeleton.startColor" endColor="skeleton.endColor" {...props}>
      {children}
    </Skeleton>
  )
}
