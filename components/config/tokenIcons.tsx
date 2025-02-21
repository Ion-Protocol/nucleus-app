import { TokenKey } from '@/types/TokenKey'
import { ChakraProps, Icon } from '@chakra-ui/react'
import React from 'react'
import { DineroIcon } from '../shared/icons/Dinero'
import { EthereumIcon } from '../shared/icons/Ethereum'
import { OptimismIcon } from '../shared/icons/Optimism'
// import { RariethIcon } from '../shared/icons/Rarieth'
import { CbBtcIcon } from '../shared/icons/CbBtc'
import { LbtcIcon } from '../shared/icons/Lbtc'
import { PumpBtcIcon } from '../shared/icons/PumpBtc'
import { RariIcon } from '../shared/icons/Rari'
import RariethIcon from '../shared/icons/rarieth.svg'
import { RswethIcon } from '../shared/icons/Rsweth'
import { SeiIcon } from '../shared/icons/Sei'
import { SupusdIcon } from '../shared/icons/Supusd'
import { SusnIcon } from '../shared/icons/Susn'
import { TokenApxethIcon } from '../shared/icons/TokenApxeth'
import { TokenBobaethIcon } from '../shared/icons/TokenBobaeth'
import { TokenEarnbtcIcon } from '../shared/icons/TokenEarnbtc'
import { TokenEarnethIcon } from '../shared/icons/TokenEarneth'
import { TokenEzethIcon } from '../shared/icons/TokenEzeth'
import { TokenFethIcon } from '../shared/icons/TokenFeth'
import { TokenIseiIcon } from '../shared/icons/TokenIsei'
import { TokenNelixirIcon } from '../shared/icons/TokenNelixir'
import { TokenPufethIcon } from '../shared/icons/TokenPufeth'
import { TokenPzethIcon } from '../shared/icons/TokenPzeth'
import { TokenRsethIcon } from '../shared/icons/TokenRseth'
import { TokenRswbtcIcon } from '../shared/icons/TokenRswbtc'
import { TokenSeiyanethIcon } from '../shared/icons/TokenSeiyaneth'
import { TokenSsethIcon } from '../shared/icons/TokenSseth'
import { TokenSwbtcIcon } from '../shared/icons/TokenSwbtc'
import { TokenTethIcon } from '../shared/icons/TokenTeth'
import { TokenWbtcIcon } from '../shared/icons/TokenWbtc'
import { TokenWeethIcon } from '../shared/icons/TokenWeeth'
import { TokenWethIcon } from '../shared/icons/TokenWeth'
import { TokenWfrxethIcon } from '../shared/icons/TokenWfrxeth'
import { UnifiBtcIcon } from '../shared/icons/UnifiBtc'
import { UnifiethIcon } from '../shared/icons/Unifieth'
import { UsnIcon } from '../shared/icons/Usn'
import { WstethIcon } from '../shared/icons/Wsteth'

function DefaultIcon() {
  return <></>
}

export const tokenIconMap: Record<TokenKey, (props: ChakraProps) => JSX.Element> = {
  [TokenKey.APXETH]: (props) => <TokenApxethIcon {...props} />,
  [TokenKey.BOBAETH]: (props) => <TokenBobaethIcon {...props} />,
  [TokenKey.DINERO]: (props) => <DineroIcon {...props} />,
  [TokenKey.EARNBTC]: (props) => <TokenEarnbtcIcon {...props} />,
  [TokenKey.EARNETH]: (props) => <TokenEarnethIcon {...props} />,
  [TokenKey.ETH]: (props) => <EthereumIcon {...props} />,
  [TokenKey.EZETH]: (props) => <TokenEzethIcon {...props} />,
  [TokenKey.FETH]: (props) => <TokenFethIcon {...props} />,
  [TokenKey.OP]: (props) => <OptimismIcon {...props} />,
  [TokenKey.PUFETH]: (props) => <TokenPufethIcon {...props} />,
  [TokenKey.RSETH]: (props) => <TokenRsethIcon {...props} />,
  [TokenKey.RSWBTC]: (props) => <TokenRswbtcIcon {...props} />,
  [TokenKey.RSWETH]: (props) => <RswethIcon {...props} />,
  [TokenKey.SEI]: (props) => <SeiIcon />,
  [TokenKey.SEIYANETH]: (props) => <TokenSeiyanethIcon {...props} />,
  [TokenKey.SFRXETH]: (props) => <TokenWfrxethIcon {...props} />,
  [TokenKey.SSETH]: (props) => <TokenSsethIcon {...props} />,
  [TokenKey.SWBTC]: (props) => <TokenSwbtcIcon {...props} />,
  [TokenKey.TETH]: (props) => <TokenTethIcon {...props} />,
  [TokenKey.WBTC]: (props) => <TokenWbtcIcon {...props} />,
  [TokenKey.WEETH]: (props) => <TokenWeethIcon {...props} />,
  [TokenKey.WETH]: (props) => <TokenWethIcon {...props} />,
  [TokenKey.WSTETH]: (props) => <WstethIcon {...props} />,
  [TokenKey.PZETH]: (props) => <TokenPzethIcon {...props} />,
  [TokenKey.ISEI]: (props) => <TokenIseiIcon {...props} />,
  [TokenKey.RARIETH]: (props) => <Icon as={RariethIcon} {...props} />,
  [TokenKey.RARI]: (props) => <RariIcon {...props} />,
  [TokenKey.UNIFIETH]: (props) => <Icon as={UnifiethIcon} {...props} />,
  [TokenKey.NELIXIR]: (props) => <Icon as={TokenNelixirIcon} {...props} />,
  [TokenKey.SUPUSD]: (props) => <SupusdIcon {...props} color="inherit" fill="none" />,
  [TokenKey.USN]: (props) => <Icon as={UsnIcon} {...props} color="inherit" fill="none" />,
  [TokenKey.SUSN]: (props) => <Icon as={SusnIcon} {...props} color="inherit" fill="none" />,
  [TokenKey.UNIFIBTC]: (props) => <Icon as={UnifiBtcIcon} {...props} color="inherit" fill="none" />,
  [TokenKey.LBTC]: (props) => <Icon as={LbtcIcon} {...props} color="inherit" fill="none" />,
  [TokenKey.PUMPBTC]: (props) => <Icon as={PumpBtcIcon} {...props} color="inherit" fill="none" />,
  [TokenKey.CBBTC]: (props) => <Icon as={CbBtcIcon} {...props} color="inherit" fill="none" />,
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
