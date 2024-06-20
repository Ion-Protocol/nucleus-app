import { TokenKey } from '@/config/token'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { EthereumIcon } from '../icons/Ethereum'
import { RswethIcon } from '../icons/Rsweth'
import { SeiIcon } from '../icons/Sei'
import { TokenEzethIcon } from '../icons/TokenEzeth'
import { TokenRsethIcon } from '../icons/TokenRseth'
import { TokenWeethIcon } from '../icons/TokenWeeth'
import { TokenWethIcon } from '../icons/TokenWeth'
import { WstethIcon } from '../icons/Wsteth'

export const tokenIconMap: Record<TokenKey, (props: ChakraProps) => JSX.Element> = {
  [TokenKey.ETH]: (props) => <EthereumIcon {...props} />,
  [TokenKey.WETH]: (props) => <TokenWethIcon {...props} />,
  [TokenKey.WEETH]: (props) => <TokenWeethIcon {...props} />,
  [TokenKey.WSTETH]: (props) => <WstethIcon {...props} />,
  [TokenKey.SEI]: (props) => <SeiIcon {...props} />,
  [TokenKey.RSETH]: (props) => <TokenRsethIcon {...props} />,
  [TokenKey.RSWETH]: (props) => <RswethIcon {...props} />,
  [TokenKey.EZETH]: (props) => <TokenEzethIcon {...props} />,
}

interface TokenIconProps extends ChakraProps {
  tokenKey?: TokenKey
}

export const TokenIcon: React.FC<TokenIconProps> = ({ tokenKey = TokenKey.WETH, ...props }) => {
  const IconComponent = tokenIconMap[tokenKey]
  if (!IconComponent) {
    console.error(`No icon component found for token key: ${tokenKey}`)
    return null
  }
  return <IconComponent {...props} />
}
