import { SeiIcon } from '@/components/shared/icons/Sei'
import { ChainKey } from '@/types/ChainKey'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { OptimismIcon } from '../shared/icons/Optimism'

export const chainIconMap: Partial<Record<ChainKey, (props: ChakraProps) => JSX.Element>> = {
  [ChainKey.ETHEREUM]: (props) => <EthereumIcon {...props} />,
  [ChainKey.SEI]: (props) => <SeiIcon {...props} />,
  [ChainKey.OPTIMISM_SEPOLIA_LAYER_ZERO]: (props) => <OptimismIcon {...props} />,
  [ChainKey.OPTIMISM_SEPOLIA_OPSTACK]: (props) => <OptimismIcon {...props} />,
}

interface ChainIconMapProps extends ChakraProps {
  chainKey?: ChainKey
}

export const ChainIcon: React.FC<ChainIconMapProps> = ({ chainKey: chainKey = ChainKey.SEI, ...props }) => {
  const IconComponent = chainIconMap[chainKey]
  if (!IconComponent) {
    console.error(`No icon component found for chain key: ${chainKey}`)
    return null
  }
  return <IconComponent {...props} />
}
