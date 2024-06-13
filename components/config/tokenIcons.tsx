import { TokenKey } from '@/config/token'
import { ChakraProps } from '@chakra-ui/react'
import React from 'react'
import { EthereumIcon } from '../icons/Ethereum'
import { TokenWethIcon } from '../icons/TokenWeth'
import { WstethIcon } from '../icons/Wsteth'

export const tokenIconMap: Record<TokenKey, (props: ChakraProps) => JSX.Element> = {
  [TokenKey.ETH]: (props) => <EthereumIcon {...props} />,
  [TokenKey.WETH]: (props) => <TokenWethIcon {...props} />,
  [TokenKey.WSTETH]: (props) => <WstethIcon {...props} />,
}

interface TokenIconProps extends ChakraProps {
  tokenKey?: TokenKey
}

export const TokenIcon: React.FC<TokenIconProps> = ({ tokenKey = TokenKey.ETH, ...props }) => {
  const IconComponent = tokenIconMap[tokenKey]
  if (!IconComponent) {
    console.error(`No icon component found for token key: ${tokenKey}`)
    return null
  }
  return <IconComponent {...props} />
}