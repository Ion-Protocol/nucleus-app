import { TokenKey } from '@/types/TokenKey'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { FraxIcon } from '../shared/icons/Frax'
import { OptimismIcon } from '../shared/icons/Optimism'
import { RswethIcon } from '../shared/icons/Rsweth'
import { SeiIcon } from '../shared/icons/Sei'
import { TokenEzethIcon } from '../shared/icons/TokenEzeth'
import { TokenRsethIcon } from '../shared/icons/TokenRseth'
import { TokenSwbtcIcon } from '../shared/icons/TokenSwbtc'
import { TokenWbtcIcon } from '../shared/icons/TokenWbtc'
import { TokenWeethIcon } from '../shared/icons/TokenWeeth'
import { TokenWethIcon } from '../shared/icons/TokenWeth'
import { TokenWfrxethIcon } from '../shared/icons/TokenWfrxeth'
import { WstethIcon } from '../shared/icons/Wsteth'

function DefaultIcon() {
  return <></>
}

export const tokenIconMap: Record<TokenKey, (props: ChakraProps) => JSX.Element> = {
  [TokenKey.ETH]: (props) => <EthereumIcon {...props} />,
  [TokenKey.WETH]: (props) => <TokenWethIcon {...props} />,
  [TokenKey.WEETH]: (props) => <TokenWeethIcon {...props} />,
  [TokenKey.WSTETH]: (props) => <WstethIcon {...props} />,
  [TokenKey.SEI]: (props) => <SeiIcon {...props} />,
  [TokenKey.RSETH]: (props) => <TokenRsethIcon {...props} />,
  [TokenKey.RSWETH]: (props) => <RswethIcon {...props} />,
  [TokenKey.EZETH]: (props) => <TokenEzethIcon {...props} />,
  [TokenKey.OP]: (props) => <OptimismIcon {...props} />,
  [TokenKey.FRAX]: (props) => <FraxIcon {...props} />,
  [TokenKey.WBTC]: (props) => <TokenWbtcIcon {...props} />,
  [TokenKey.SWBTC]: (props) => <TokenSwbtcIcon {...props} />,
  [TokenKey.RSWBTC]: (props) => <TokenWbtcIcon {...props} />,
  [TokenKey.WFRXETH]: (props) => <TokenWfrxethIcon {...props} />,
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
