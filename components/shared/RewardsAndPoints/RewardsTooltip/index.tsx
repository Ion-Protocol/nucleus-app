import { ChainKey } from '@/types/ChainKey'
import { ChakraProps, Popover, PopoverContent, PopoverTrigger, Portal } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import RewardsTooltipContent from '../RewardsTooltipContent'
import { TokenKey } from '@/types/TokenKey'

interface RewardsTooltipProps extends PropsWithChildren, ChakraProps {
  tokenKey: TokenKey | null
}

function RewardsTooltip({ tokenKey, children, ...chakraProps }: RewardsTooltipProps) {
  return (
    <Popover trigger="hover" placement="bottom" offset={[0, -12]} {...chakraProps}>
      <PopoverTrigger>
        <div>{children}</div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          onClick={(e) => e.stopPropagation()} // Prevent event bubbling
          w="260px"
          p={0}
          bg="backgroundAlternate"
          borderRadius="10px"
          boxShadow="none"
          border="1px solid"
          borderColor="border"
          pointerEvents="auto"
        >
          <RewardsTooltipContent tokenKey={tokenKey} />
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default RewardsTooltip
