import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { claimRewards } from '@/store/slices/networkAssets/thunks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { selectTotalClaimables } from '@/store/slices/userProofSlice/selectors'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RewardsAndHistoryOwnProps) => {
  const networkAssetKeyFromRoute = selectNetworkAssetFromRoute(state)
  const networkAsset = networkAssetKeyFromRoute ? tokensConfig[networkAssetKeyFromRoute] : null
  const networkAssetName = networkAsset?.name || null
  const claimables = selectTotalClaimables(state)
  const claimableTokenKeys = claimables.map((claimable) => claimable.tokenKey)
  const shouldShowRewardsAndHistoryTable = claimables.length > 0
  const shouldDisableClaim = claimables.every((claimable) => claimable.amount === '0')
  return {
    networkAssetKey: networkAssetKeyFromRoute,
    networkAsset,
    networkAssetName,
    claimableTokenKeys,
    shouldShowRewardsAndHistoryTable,
    shouldDisableClaim,
  }
}

const mapDispatch = {
  claimRewards: claimRewards,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RewardsAndHistoryOwnProps {}

interface RewardsAndHistoryProps extends RewardsAndHistoryOwnProps, PropsFromRedux, ChakraProps {}

export namespace RewardsAndHistoryConnector {
  export const Connector = connector
  export type Props = RewardsAndHistoryProps
}
