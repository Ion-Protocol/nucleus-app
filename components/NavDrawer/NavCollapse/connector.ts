import { RootState } from '@/store'
import { selectNetworkAssetNavOpen, toggleNetworkAssetNav } from '@/store/slices/ui'
import { PropsWithChildren, ReactElement } from 'react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    isOpen: selectNetworkAssetNavOpen(state),
  }
}

const mapDispatch = {
  toggle: toggleNetworkAssetNav,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface NavCollapseProps extends PropsFromRedux, PropsWithChildren {
  title: string
  leftIcon?: ReactElement
}

export namespace NavCollapseConnector {
  export const Connector = connector
  export type Props = NavCollapseProps
}
