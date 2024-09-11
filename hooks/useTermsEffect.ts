import { useAppDispatch } from '@/store/hooks'
import { setTermsAccepted } from '@/store/slices/status'
import { openTermsModal } from '@/store/slices/ui'
import { useEffect } from 'react'

export function useTermsEffect() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const termsAccepted = localStorage.getItem('termsAccepted')

    if (termsAccepted === 'true') {
      dispatch(setTermsAccepted(true))
    } else {
      dispatch(openTermsModal())
    }
  }, [dispatch])
}
