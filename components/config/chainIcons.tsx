// import SeiIcon from '@/components/shared/icons/Sei_Symbol_Red.svg'
import { ChainKey } from '@/types/ChainKey'
import { IconProps } from '@chakra-ui/react'
import React from 'react'
import { AstrolIcon } from '../shared/icons/Astrol'
import { BobaIcon } from '../shared/icons/Boba'
import { DineroIcon } from '../shared/icons/Dinero'
import { EclipseLargeIcon } from '../shared/icons/EclipseLarge'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { FormLargeIcon } from '../shared/icons/FormLarge'
import { InvariantIcon } from '../shared/icons/Invariant'
import { JellyverseIcon } from '../shared/icons/Jellyverse'
import { NeptuneIcon } from '../shared/icons/Neptune'
import { OkuIcon } from '../shared/icons/Oku'
import { OrcaIcon } from '../shared/icons/Orca'
import { RariLargeIcon } from '../shared/icons/RariLarge'
import { SandglassIcon } from '../shared/icons/Sandglass'
import { SaveNetworkIcon } from '../shared/icons/SaveNetwork'
import { SeiLargeIcon } from '../shared/icons/SeiLarge'
import { SwellLargeIcon } from '../shared/icons/SwellLarge'
import { TeahouseIcon } from '../shared/icons/Teahouse'
import { UnifiLargeIcon } from '../shared/icons/UnifiLarge'

export const chainIconMap: Partial<Record<ChainKey, (props: IconProps) => JSX.Element>> = {
  [ChainKey.ETHEREUM]: (props) => <EthereumIcon {...props} />,
  [ChainKey.SEI]: (props: IconProps) => <SeiLargeIcon {...props} />,
  [ChainKey.SWELL]: (props) => <SwellLargeIcon {...props} />,
  [ChainKey.ECLIPSE]: (props) => <EclipseLargeIcon {...props} />,
  [ChainKey.DINERO]: (props) => <DineroIcon {...props} />,
  [ChainKey.BOBA]: (props) => <BobaIcon {...props} />,
  [ChainKey.FORM]: (props) => <FormLargeIcon {...props} />,
  [ChainKey.RARI]: (props) => <RariLargeIcon {...props} />,
  [ChainKey.JELLYVERSE]: (props) => <JellyverseIcon {...props} />,
  [ChainKey.ORCA]: (props) => <OrcaIcon {...props} />,
  [ChainKey.INVARIANT]: (props) => <InvariantIcon {...props} />,
  [ChainKey.SAVE]: (props) => <SaveNetworkIcon {...props} />,
  [ChainKey.ASTROL]: (props) => <AstrolIcon {...props} />,
  [ChainKey.UNIFI]: (props) => <UnifiLargeIcon {...props} />,
  [ChainKey.SANDGLASS]: (props) => <SandglassIcon {...props} />,
  [ChainKey.NEPTUNE]: (props) => <NeptuneIcon {...props} />,
  [ChainKey.OKU]: (props) => <OkuIcon {...props} />,
  [ChainKey.TEAHOUSE]: (props) => <TeahouseIcon {...props} />,
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
