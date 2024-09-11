import { etherscanBaseUrl } from '@/config/constants'
import { RootState } from '@/store'
import {
  selectChainConfig,
  selectContractAddressByName,
  selectYieldAssetFullNameByChainKey,
} from '@/store/slices/bridges'
import { ChainKey } from '@/types/ChainKey'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: BridgeTitleOwnProps) => {
  const chainKey = state.router.query?.chain as ChainKey
  const chainConfig = selectChainConfig(state)

  const yieldAssetFullName = selectYieldAssetFullNameByChainKey(chainKey)(state)
  const description = chainConfig?.description || ''

  const boringVaultAddress = selectContractAddressByName('boringVault')(state)
  const etherscanHref = boringVaultAddress ? `${etherscanBaseUrl}${boringVaultAddress}` : undefined
  const yieldAssetKey = chainConfig?.yieldAsset || null
  const chainName = chainConfig?.name || ''

  return {
    chainKey,
    chainName,
    yieldAssetFullName,
    yieldAssetKey,
    description,
    etherscanHref,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface BridgeTitleOwnProps {}

interface BridgeTitleProps extends BridgeTitleOwnProps, PropsFromRedux, ChakraProps {}

export namespace BridgeTitleConnector {
  export const Connector = connector
  export type Props = BridgeTitleProps
}
