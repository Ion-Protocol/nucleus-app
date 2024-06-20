import { ChainKey } from '@/config/chains'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { EthereumIcon } from '../icons/Ethereum'
import { IonTokenIcon } from '../icons/IonToken'

export const chainIconMap: Record<ChainKey, (props: ChakraProps) => JSX.Element> = {
  [ChainKey.ETHEREUM]: (props) => <EthereumIcon {...props} />,
  [ChainKey.TENDERLY]: (props) => <IonTokenIcon {...props} />,
}

interface ChainIconProps extends ChakraProps {
  chainKey?: ChainKey
}

export const ChainIcon: React.FC<ChainIconProps> = ({ chainKey = ChainKey.ETHEREUM, ...props }) => {
  const IconComponent = chainIconMap[chainKey]
  if (!IconComponent) {
    console.error(`No icon component found for chain key: ${chainKey}`)
    return null
  }
  return <IconComponent {...props} />
}
