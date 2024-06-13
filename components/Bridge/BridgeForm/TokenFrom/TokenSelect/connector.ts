import { BridgeKey } from '@/config/bridges'
import { chainsConfig } from '@/config/chains'
import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectBridgeSourceChain, selectBridgeTokenKey } from '@/store/slices/bridges'
import { setBridgeToken } from '@/store/slices/bridges/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenSelectOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey

  const sourceChainKey = selectBridgeSourceChain(state)
  const sourceChain = sourceChainKey ? chainsConfig[sourceChainKey] : null
  const tokenKeys = sourceChain?.availableTokens || [TokenKey.WETH]
  const tokens = tokenKeys.map((key) => ({ key, ...tokensConfig[key] }))

  const selectedTokenKey = selectBridgeTokenKey(state, bridgeKey) || TokenKey.WETH
  const selectedToken = selectedTokenKey ? tokensConfig[selectedTokenKey] : tokensConfig[TokenKey.WETH]
  const selectedTokenWithKey = { key: selectedTokenKey, ...selectedToken }

  return {
    tokens,
    selected: selectedTokenWithKey,
  }
}

const mapDispatch = {
  onChange: setBridgeToken,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

export type TokenSelectRole = 'from' | 'to'
interface TokenSelectOwnProps {}

interface TokenSelectProps extends TokenSelectOwnProps, PropsFromRedux {}

export namespace TokenSelectConnector {
  export const Connector = connector
  export type Props = TokenSelectProps
}
