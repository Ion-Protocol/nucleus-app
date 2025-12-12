import { openDeprecationModal } from '@/store/slices/ui/slice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export function useDeprecationModal() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Always show the deprecation modal - app is fully deprecated
    const timer = setTimeout(() => {
      dispatch(openDeprecationModal())
    }, 500)

    return () => clearTimeout(timer)
  }, [dispatch])
}