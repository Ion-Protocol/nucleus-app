import { Button, ButtonProps, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { useAccount } from 'wagmi'

interface ConnectAwareButtonProps extends ButtonProps, PropsWithChildren {}

export function ConnectAwareButton({ children, ...props }: ConnectAwareButtonProps) {
  const { isConnected } = useAccount()
  return (
    <Tooltip label={!isConnected && 'You need to connect your wallet'}>
      <Button isDisabled={!isConnected} {...props}>
        {children}
      </Button>
    </Tooltip>
  )
}
