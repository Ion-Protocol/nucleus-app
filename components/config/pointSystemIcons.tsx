import { PointSystemKey } from '@/types/PointSystem'
import { ChakraProps, Icon } from '@chakra-ui/react'
import React from 'react'
import { BabylonIcon } from '../shared/icons/Babylon'
import { CarrotsIcon } from '../shared/icons/Carrots'
import { EclipseIcon } from '../shared/icons/Eclipse'
import { EigenlayerPointsIcon } from '../shared/icons/EigenlayerPoints'
import { FireBitcoinIcon } from '../shared/icons/FireBitcoin'
import { FormIcon } from '../shared/icons/Form'
import { IonTokenIcon } from '../shared/icons/IonToken'
import { LorenzoStbtcIcon } from '../shared/icons/LorenzoStbtc'
import { MellowIcon } from '../shared/icons/Mellow'
import { NucleusLogoBlackIcon } from '../shared/icons/NucleusLogo'
import { PumpBtcIcon } from '../shared/icons/PumpBtc'
import { RenzoIcon } from '../shared/icons/Renzo'
import { RswellIcon } from '../shared/icons/Rswell'
import { SolvBtcIcon } from '../shared/icons/SolvBtc'
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
  [PointSystemKey.PUMPBTC]: (props) => <PumpBtcIcon {...props} />,
  [PointSystemKey.SOLVBTC]: (props) => <SolvBtcIcon {...props} />,
  [PointSystemKey.BABYLON]: (props) => <BabylonIcon {...props} />,
  [PointSystemKey.LORENZOSTBTC]: (props) => <LorenzoStbtcIcon {...props} />,
  [PointSystemKey.FIREBTC]: (props) => <FireBitcoinIcon {...props} />,
  [PointSystemKey.CARROTS]: (props) => <Icon as={CarrotsIcon} {...props} />,
  [PointSystemKey.GRASS]: (props) => <EclipseIcon {...props} />,
  [PointSystemKey.RSWELL]: (props) => <Icon as={RswellIcon} {...props} />,
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
