import { SeiIcon } from '@/components/shared/icons/Sei'
import { BridgeKey } from '@/config/bridges'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'

export const bridgeIconMap: Record<BridgeKey, (props: ChakraProps) => JSX.Element> = {
  [BridgeKey.SEI]: (props) => <SeiIcon {...props} />,
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
