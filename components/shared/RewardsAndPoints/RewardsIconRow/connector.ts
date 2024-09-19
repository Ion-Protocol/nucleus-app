import { RootState } from '@/store'
import { selectApyTokenKeys, selectPointSystemKeysForNetworkAsset } from '@/store/slices/networkAssets'
import { TokenKey } from '@/types/TokenKey'
import { ChakraProps } from '@chakra-ui/react'
import { connect, ConnectedProps } from 'react-redux'

const mapState = (state: RootState, ownProps: RewardsIconRowOwnProps) => {
  const { tokenKey: networkAssetKey } = ownProps

  if (networkAssetKey === null) {
    return {
      apyTokenKeys: [],
      pointSystemKeys: [],
    }
  }

  const apyTokenKeys = selectApyTokenKeys(state, networkAssetKey)
  const pointSystemKeys = selectPointSystemKeysForNetworkAsset(state, networkAssetKey)

  return {
    apyTokenKeys,
    pointSystemKeys,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RewardsIconRowOwnProps {
  tokenKey: TokenKey | null
}

interface RewardsIconRowProps extends RewardsIconRowOwnProps, PropsFromRedux, ChakraProps {}

export namespace RewardsIconRowConnector {
  export const Connector = connector
  export type Props = RewardsIconRowProps
}
