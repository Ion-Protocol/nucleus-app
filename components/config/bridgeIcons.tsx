import { SeiIcon } from '@/components/shared/icons/Sei'
import { BridgeKey } from '@/config/chains'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { MorphLogo } from '../shared/icons/Morph'
import { OptimismIcon } from '../shared/icons/Optimism'
import { BobaNetworkIcon } from '../shared/icons/BobaNetwork'
import { FraxIcon } from '../shared/icons/Frax'

export const bridgeIconMap: Partial<Record<BridgeKey, (props: ChakraProps) => JSX.Element>> = {
  [BridgeKey.ETHEREUM]: (props) => <EthereumIcon {...props} />,
  [BridgeKey.SEI]: (props) => <SeiIcon {...props} />,
  [BridgeKey.MORPH]: (props) => <MorphLogo {...props} />,
  [BridgeKey.OPTIMISM_SEPOLIA_LAYER_ZERO]: (props) => <OptimismIcon {...props} />,
  [BridgeKey.OPTIMISM_SEPOLIA_OPSTACK]: (props) => <OptimismIcon {...props} />,
  [BridgeKey.BOBA]: (props) => <BobaNetworkIcon {...props} />,
  [BridgeKey.FRAX]: (props) => <FraxIcon {...props} />,
}

interface BridgeIconMapProps extends ChakraProps {
  bridgeKey?: BridgeKey
}

export const BridgeIcon: React.FC<BridgeIconMapProps> = ({ bridgeKey = BridgeKey.SEI, ...props }) => {
  const IconComponent = bridgeIconMap[bridgeKey]
  if (!IconComponent) {
    console.error(`No icon component found for bridge key: ${bridgeKey}`)
    return null
  }
  return <IconComponent {...props} />
}
