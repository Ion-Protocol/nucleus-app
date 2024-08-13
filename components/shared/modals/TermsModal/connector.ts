import { RootState } from '@/store'
import { acceptTerms } from '@/store/slices/status'
import { closeTermsModal, selectTermsModalOpen } from '@/store/slices/ui'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    isOpen: selectTermsModalOpen(state),
  }
}

const mapDispatch = {
  onAccept: () => {
    return (dispatch: any) => {
      dispatch(acceptTerms())
      dispatch(closeTermsModal())
    }
  },
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TermsModalProps extends PropsFromRedux {}

export namespace TermsModalConnector {
  export const Connector = connector
  export type Props = TermsModalProps
}
