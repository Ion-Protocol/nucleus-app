import { DEPRECATION_CONFIG } from '@/config/deprecation'
import { openDeprecationModal } from '@/store/slices/ui/slice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export function useDeprecationModal() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if user has dismissed the modal before
    const hasUserDismissed = localStorage.getItem(DEPRECATION_CONFIG.MODAL_DISMISSED_KEY) === 'true'

    // Show modal on every visit until dismissed (as per requirement)
    if (!hasUserDismissed) {
      // Small delay to ensure app is fully loaded
      const timer = setTimeout(() => {
        dispatch(openDeprecationModal())
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [dispatch])
}
