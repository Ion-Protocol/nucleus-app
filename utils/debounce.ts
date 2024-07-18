export function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let timeoutID: number | undefined

  return function (...args: Parameters<F>) {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = window.setTimeout(() => fn(...args), delay)
  }
}
