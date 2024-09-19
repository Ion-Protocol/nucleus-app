import { etherscanBaseUrl } from '@/config/constants'
import { RootState } from '@/store'
import { selectContractAddressByName, selectNetworkAssetConfig } from '@/store/slices/networkAssets'
import { TokenKey } from '@/types/TokenKey'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: NetworkAssetTitleOwnProps) => {
  const networkAssetKey = state.router.query?.token as TokenKey
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const networkAssetFullName = networkAssetConfig?.token?.fullName
  const networkAssetName = networkAssetConfig?.token?.name
  const description = networkAssetConfig?.description || ''

  const boringVaultAddress = selectContractAddressByName('boringVault')(state)
  const etherscanHref = boringVaultAddress ? `${etherscanBaseUrl}${boringVaultAddress}` : undefined

  return {
    networkAssetName,
    networkAssetFullName,
    networkAssetKey,
    description,
    etherscanHref,
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
