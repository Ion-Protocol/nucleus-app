import { ChainKey } from '@/config/chains'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { IonTokenIcon } from '../shared/icons/IonToken'

export const chainIconMap: Partial<Record<ChainKey, (props: ChakraProps) => JSX.Element>> = {
  [ChainKey.MAINNET]: (props) => <EthereumIcon {...props} />,
  [ChainKey.TENDERLY_MAINNET]: (props) => <IonTokenIcon {...props} />,
}

interface ChainIconProps extends ChakraProps {
  chainKey?: ChainKey
}

export const ChainIcon: React.FC<ChainIconProps> = ({ chainKey = ChainKey.MAINNET, ...props }) => {
  const IconComponent = chainIconMap[chainKey]
  if (!IconComponent) {
    console.error(`No icon component found for chain key: ${chainKey}`)
    return null
  }
  return <IconComponent {...props} />
}
