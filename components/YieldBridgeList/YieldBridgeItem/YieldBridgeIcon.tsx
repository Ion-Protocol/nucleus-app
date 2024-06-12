import { ArbitrumIcon } from '@/components/icons/Arbitrum'
import { BobaNetworkIcon } from '@/components/icons/BobaNetwork'
import { EdgelessIcon } from '@/components/icons/Edgeless'
import { OptimismIcon } from '@/components/icons/Optimism'
import { SwellChainIcon } from '@/components/icons/SwellChain'
import { SeiIcon } from '@/components/icons/Sei'
import { BridgeKey } from '@/config/bridges'
import { ChakraProps } from '@chakra-ui/react'

interface YieldBridgeIconProps extends ChakraProps {
  bridgeKey: BridgeKey
}

export function YieldBridgeIcon({ bridgeKey, ...props }: YieldBridgeIconProps) {
  const bridgeIconMap: Record<BridgeKey, React.ReactNode> = {
    [BridgeKey.ARBITRUM]: <ArbitrumIcon {...props} />,
    [BridgeKey.EDGELESS]: <EdgelessIcon {...props} />,
    [BridgeKey.SWELL]: <SwellChainIcon {...props} />,
    [BridgeKey.OPTIMISM]: <OptimismIcon {...props} />,
    [BridgeKey.BOBA_NETWORK]: <BobaNetworkIcon {...props} />,
    [BridgeKey.SEI]: <SeiIcon {...props} />,
  }

  return bridgeIconMap[bridgeKey]
}
