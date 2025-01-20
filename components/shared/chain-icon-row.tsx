import { Box, Flex, Tooltip } from '@chakra-ui/react'
import { ChainKey } from '@/types/ChainKey'
import { ChainIcon } from '../config/chainIcons'
import { chainsConfig } from '@/config/chains'

interface ChainIconRowProps {
  chains?: ChainKey[]
}

export function ChainIconRow({ chains }: ChainIconRowProps) {
  if (!chains || chains.length === 0) return null

  const overlapOffset = 8 // Define a variable for the overlap and hover offset

  const icons = chains.map((chainKey, index) => {
    return (
      <Tooltip key={chainKey} label={chainsConfig[chainKey]?.name || chainKey} hasArrow placement="top">
        <Box
          // Overlap this icon with the previous one by overlapOffset
          ml={index === 0 ? 0 : `-${overlapOffset}px`}
          // Hover effect: move it up by overlapOffset
          _hover={{
            transform: `translateY(-4px)`,
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <ChainIcon fontSize="24px" chainKey={chainKey} />
        </Box>
      </Tooltip>
    )
  })

  return <Flex>{icons}</Flex>
}
