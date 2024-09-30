import { SeiIcon } from '@/components/shared/icons/Sei'
import { ChainKey } from '@/types/ChainKey'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { DineroIcon } from '../shared/icons/Dinero'
import { EclipseIcon } from '../shared/icons/Eclipse'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { SwellChainIcon } from '../shared/icons/SwellChain'
import { TokenFethIcon } from '../shared/icons/TokenFeth'
import { FormIcon } from '../shared/icons/Form'

export const chainIconMap: Partial<Record<ChainKey, (props: ChakraProps) => JSX.Element>> = {
  [ChainKey.ETHEREUM]: (props) => <EthereumIcon {...props} />,
  [ChainKey.SEI]: (props) => <SeiIcon {...props} />,
  [ChainKey.SWELL]: (props) => <SwellChainIcon {...props} />,
  [ChainKey.ECLIPSE]: (props) => <EclipseIcon {...props} />,
  [ChainKey.DINERO]: (props) => <DineroIcon {...props} />,
  [ChainKey.FORM]: (props) => <FormIcon {...props} />,
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
