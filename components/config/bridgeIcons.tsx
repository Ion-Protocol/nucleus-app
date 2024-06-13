import React from 'react'
import { ArbitrumIcon } from '@/components/icons/Arbitrum'
import { BobaNetworkIcon } from '@/components/icons/BobaNetwork'
import { EdgelessIcon } from '@/components/icons/Edgeless'
import { OptimismIcon } from '@/components/icons/Optimism'
import { SwellChainIcon } from '@/components/icons/SwellChain'
import { SeiIcon } from '@/components/icons/Sei'
import { BridgeKey } from '@/config/bridges'
import { ChakraProps } from '@chakra-ui/react'

export const bridgeIconMap: Record<BridgeKey, (props: ChakraProps) => JSX.Element> = {
  [BridgeKey.ARBITRUM]: (props) => <ArbitrumIcon {...props} />,
  [BridgeKey.EDGELESS]: (props) => <EdgelessIcon {...props} />,
  [BridgeKey.SWELL]: (props) => <SwellChainIcon {...props} />,
  [BridgeKey.OPTIMISM]: (props) => <OptimismIcon {...props} />,
  [BridgeKey.BOBA_NETWORK]: (props) => <BobaNetworkIcon {...props} />,
  [BridgeKey.SEI]: (props) => <SeiIcon {...props} />,
}

interface BridgeIconMapProps extends ChakraProps {
  bridgeKey?: BridgeKey
}

export const BridgeIcon: React.FC<BridgeIconMapProps> = ({ bridgeKey = BridgeKey.ARBITRUM, ...props }) => {
  const IconComponent = bridgeIconMap[bridgeKey]
  if (!IconComponent) {
    console.error(`No icon component found for bridge key: ${bridgeKey}`)
    return null
  }
  return <IconComponent {...props} />
}
