import DeprecationModal from './DeprecationModal'
import ErrorModal from './ErrorModal'
import TermsModal from './TermsModal'
import TransactionSuccessModal from './TransactionSuccessModal'

export function ModalsContainer() {
  return (
    <>
      <ErrorModal />
      <TransactionSuccessModal />
      <TermsModal />
      <DeprecationModal />
    </>
  )
}
