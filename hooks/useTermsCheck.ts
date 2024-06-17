import { useEffect } from 'react'

export function useTermsCheck() {
  useEffect(() => {
    const termsAccepted = localStorage.getItem('termsAccepted')

    if (!termsAccepted) {
      localStorage.setItem('termsAccepted', 'true')
    }
  }, [])
}
