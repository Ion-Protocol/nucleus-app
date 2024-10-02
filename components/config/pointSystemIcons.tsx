import { PointSystemKey } from '@/types/PointSystem'
import { ChakraProps, Image } from '@chakra-ui/react'
import React from 'react'
import { EigenlayerPointsIcon } from '../shared/icons/EigenlayerPoints'
import { FormIcon } from '../shared/icons/Form'
import { IonTokenIcon } from '../shared/icons/IonToken'
import { MellowIcon } from '../shared/icons/Mellow'
import { NucleusLogoBlackIcon } from '../shared/icons/NucleusLogo'
import { RenzoIcon } from '../shared/icons/Renzo'
import { SwellChainIcon } from '../shared/icons/SwellChain'
import { SymbioticIcon } from '../shared/icons/Symbiotic'

export const pointSystemIconMap: Partial<Record<PointSystemKey, (props: ChakraProps) => JSX.Element>> = {
  [PointSystemKey.ION]: (props) => <IonTokenIcon {...props} />,
  [PointSystemKey.NUCLEUS]: (props) => <NucleusLogoBlackIcon {...props} />,
  [PointSystemKey.SWELL]: (props) => <SwellChainIcon {...props} />,
  [PointSystemKey.FORM]: (props) => <FormIcon {...props} />,
  [PointSystemKey.RENZO]: (props) => <RenzoIcon {...props} />,
  [PointSystemKey.EIGENLAYER]: (props) => <EigenlayerPointsIcon {...props} />,
  [PointSystemKey.SYMBIOTIC]: (props) => <SymbioticIcon {...props} />,
  [PointSystemKey.MELLOW]: (props) => <MellowIcon {...props} />,
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
