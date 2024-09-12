import { Button, ButtonProps } from '@chakra-ui/react'
import { useConnectModal } from '@funkit/connect'
import { PropsWithChildren } from 'react'
import { useAccount } from 'wagmi'

interface ConnectAwareButtonProps extends ButtonProps, PropsWithChildren {}

export function ConnectAwareButton({ children, ...props }: ConnectAwareButtonProps) {
  const { isDisabled } = props
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Button {...props} isDisabled={false} onClick={openConnectModal}>
        Connect Wallet
      </Button>
    )
  } else {
    return (
      <Button
        {...props}
        _hover={isDisabled ? {} : undefined}
        _active={isDisabled ? {} : undefined}
        isDisabled={isDisabled}
      >
        {children}
      </Button>
    )
  }
}
