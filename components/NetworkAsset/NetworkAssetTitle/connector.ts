import { chainsConfig } from '@/config/chains'
import { etherscanBaseUrl } from '@/config/constants'
import { RootState } from '@/store'
import { selectContractAddressByName, selectNetworkAssetConfig } from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute, selectRouterReady } from '@/store/slices/router'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: NetworkAssetTitleOwnProps) => {
  const networkAssetKey = selectNetworkAssetFromRoute(state) || null
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const networkAssetFullName = networkAssetConfig?.token?.fullName
  const description = networkAssetConfig?.description || ''
  const isRouterReady = selectRouterReady(state)
  const isRouterLoading = !networkAssetKey && !isRouterReady

  const chainNameOfNetworkAsset = networkAssetConfig?.chain ? chainsConfig[networkAssetConfig.chain].name : ''

  const boringVaultAddress = selectContractAddressByName(state, 'boringVault')
  const etherscanHref = boringVaultAddress ? `${etherscanBaseUrl}/address/${boringVaultAddress}` : undefined

  return {
    boringVaultAddress,
    networkAssetFullName,
    chainNameOfNetworkAsset,
    networkAssetKey,
    description,
    etherscanHref,
    isRouterLoading,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface NetworkAssetTitleOwnProps {}

interface NetworkAssetTitleProps extends NetworkAssetTitleOwnProps, PropsFromRedux, ChakraProps {}

export namespace NetworkAssetTitleConnector {
  export const Connector = connector
  export type Props = NetworkAssetTitleProps
}
