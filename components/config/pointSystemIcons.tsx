import { PointSystemKey } from '@/types/PointSystem'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { IonTokenIcon } from '../shared/icons/IonToken'
import { NucleusLogoBlackIcon } from '../shared/icons/NucleusLogo'
import { SwellChainIcon } from '../shared/icons/SwellChain'

export const pointSystemIconMap: Partial<Record<PointSystemKey, (props: ChakraProps) => JSX.Element>> = {
  [PointSystemKey.ION]: (props) => <IonTokenIcon {...props} />,
  [PointSystemKey.NUCLEUS]: (props) => <NucleusLogoBlackIcon {...props} />,
  [PointSystemKey.SWELL]: (props) => <SwellChainIcon {...props} />,
}

interface PointSystemIconProps extends ChakraProps {
  pointSystemKey?: PointSystemKey
}

export const PointSystemIcon: React.FC<PointSystemIconProps> = ({
  pointSystemKey: pointSystemKey = PointSystemKey.ION,
  ...props
}) => {
  const IconComponent = pointSystemIconMap[pointSystemKey]
  if (!IconComponent) {
    console.error(`No icon component found for point system key: ${pointSystemKey}`)
    return null
  }
  return <IconComponent {...props} />
}
