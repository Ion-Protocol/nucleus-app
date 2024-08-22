import { Button, ButtonProps, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { useAccount } from 'wagmi'
import { IonTooltip } from '../IonTooltip'

interface ConnectAwareButtonProps extends ButtonProps, PropsWithChildren {}

export function ConnectAwareButton({ children, ...props }: ConnectAwareButtonProps) {
  const { isConnected } = useAccount()
  const disabled = props.isDisabled || !isConnected
  return (
    <IonTooltip label={!isConnected && 'You need to connect your wallet first'}>
      <Button {...props} _hover={disabled ? {} : undefined} _active={disabled ? {} : undefined} isDisabled={disabled}>
        {children}
      </Button>
    </IonTooltip>
  )
}
