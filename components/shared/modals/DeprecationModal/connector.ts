import { closeDeprecationModal, selectDeprecationModalOpen } from '@/store/slices/ui/slice'
import { connect } from 'react-redux'
import { RootState } from '@/store'
import { Dispatch } from '@reduxjs/toolkit'

export namespace DeprecationModalConnector {
  export interface Props {
    isOpen: boolean
    onClose: () => void
  }

  const mapStateToProps = (state: RootState) => ({
    isOpen: selectDeprecationModalOpen(state),
  })

  const mapDispatchToProps = (dispatch: Dispatch) => ({
    onClose: () => dispatch(closeDeprecationModal()),
  })

  export const Connector = connect(mapStateToProps, mapDispatchToProps)
}
