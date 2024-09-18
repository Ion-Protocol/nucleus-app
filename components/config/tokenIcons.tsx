import { TokenKey } from '@/types/TokenKey'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { DineroIcon } from '../shared/icons/Dinero'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { OptimismIcon } from '../shared/icons/Optimism'
import { RswethIcon } from '../shared/icons/Rsweth'
import { SeiIcon } from '../shared/icons/Sei'
import { TokenApxethIcon } from '../shared/icons/TokenApxeth'
import { TokenEarnbtcIcon } from '../shared/icons/TokenEarnbtc'
import { TokenEzethIcon } from '../shared/icons/TokenEzeth'
import { TokenPufethIcon } from '../shared/icons/TokenPufeth'
import { TokenRsethIcon } from '../shared/icons/TokenRseth'
import { TokenRswbtcIcon } from '../shared/icons/TokenRswbtc'
import { TokenSsethIcon } from '../shared/icons/TokenSseth'
import { TokenSwbtcIcon } from '../shared/icons/TokenSwbtc'
import { TokenTethIcon } from '../shared/icons/TokenTeth'
import { TokenWbtcIcon } from '../shared/icons/TokenWbtc'
import { TokenWeethIcon } from '../shared/icons/TokenWeeth'
import { TokenWethIcon } from '../shared/icons/TokenWeth'
import { TokenWfrxethIcon } from '../shared/icons/TokenWfrxeth'
import { WstethIcon } from '../shared/icons/Wsteth'
import { TokenSeiyanethIcon } from '../shared/icons/TokenSeiyaneth'

function DefaultIcon() {
  return <></>
}

export const tokenIconMap: Record<TokenKey, (props: ChakraProps) => JSX.Element> = {
  [TokenKey.ETH]: (props) => <EthereumIcon {...props} />,
  [TokenKey.WETH]: (props) => <TokenWethIcon {...props} />,
  [TokenKey.WEETH]: (props) => <TokenWeethIcon {...props} />,
  [TokenKey.WSTETH]: (props) => <WstethIcon {...props} />,
  [TokenKey.SEIYANETH]: (props) => <TokenSeiyanethIcon {...props} />,
  [TokenKey.SSETH]: (props) => <TokenSsethIcon {...props} />,
  [TokenKey.RSETH]: (props) => <TokenRsethIcon {...props} />,
  [TokenKey.RSWETH]: (props) => <RswethIcon {...props} />,
  [TokenKey.EZETH]: (props) => <TokenEzethIcon {...props} />,
  [TokenKey.OP]: (props) => <OptimismIcon {...props} />,
  [TokenKey.WBTC]: (props) => <TokenWbtcIcon {...props} />,
  [TokenKey.SWBTC]: (props) => <TokenSwbtcIcon {...props} />,
  [TokenKey.RSWBTC]: (props) => <TokenRswbtcIcon {...props} />,
  [TokenKey.EARNBTC]: (props) => <TokenEarnbtcIcon {...props} />,
  [TokenKey.TETH]: (props) => <TokenTethIcon {...props} />,
  [TokenKey.APXETH]: (props) => <TokenApxethIcon {...props} />,
  [TokenKey.PUFETH]: (props) => <TokenPufethIcon {...props} />,
  [TokenKey.SFRXETH]: (props) => <TokenWfrxethIcon {...props} />,
  [TokenKey.SEI]: (props) => <SeiIcon {...props} />,
  [TokenKey.DINERO]: (props) => <DineroIcon {...props} />,
}

interface TokenIconProps extends ChakraProps {
  tokenKey: TokenKey | null
}

export const TokenIcon: React.FC<TokenIconProps> = ({ tokenKey = TokenKey.WETH, ...props }) => {
  const IconComponent = tokenKey ? tokenIconMap[tokenKey] : DefaultIcon
  if (!IconComponent) {
    console.error(`No icon component found for token key: ${tokenKey}`)
    return null
  }
  return <IconComponent {...props} />
}
