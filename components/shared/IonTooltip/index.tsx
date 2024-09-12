import { Tooltip, TooltipProps } from '@chakra-ui/react'

interface IonTooltipProps extends TooltipProps {}

export function IonTooltip({ children, ...props }: IonTooltipProps) {
  return (
    <Tooltip hasArrow bg="tooltip" color="textInverse" borderRadius="6px" {...props}>
      {children}
    </Tooltip>
  )
}
