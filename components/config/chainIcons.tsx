import { SeiIcon } from '@/components/shared/icons/Sei'
// import SeiIcon from '@/components/shared/icons/Sei_Symbol_Red.svg'
import { ChainKey } from '@/types/ChainKey'
import { IconProps } from '@chakra-ui/react'
import React from 'react'
import { BobaIcon } from '../shared/icons/Boba'
import { DineroIcon } from '../shared/icons/Dinero'
import { EclipseIcon } from '../shared/icons/Eclipse'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { FormIcon } from '../shared/icons/Form'
import { RariIcon } from '../shared/icons/Rari'
import { SwellChainIcon } from '../shared/icons/SwellChain'

export const chainIconMap: Partial<Record<ChainKey, (props: IconProps) => JSX.Element>> = {
  [ChainKey.ETHEREUM]: (props) => <EthereumIcon {...props} />,
  // The SeiIcon is broken and doesn't play with Chakra's Icons
  [ChainKey.SEI]: (props: IconProps) => <SeiIcon />,
  [ChainKey.SWELL]: (props) => <SwellChainIcon {...props} />,
  [ChainKey.ECLIPSE]: (props) => <EclipseIcon {...props} />,
  [ChainKey.DINERO]: (props) => <DineroIcon {...props} />,
  [ChainKey.FORM]: (props) => <FormIcon {...props} />,
  [ChainKey.RARI]: (props) => <RariIcon {...props} />,
  [ChainKey.BOBA]: (props) => <BobaIcon {...props} />,
}

interface ChainIconMapProps extends IconProps {
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
