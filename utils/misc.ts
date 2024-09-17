/**
 * Defers the execution of a callback function to the next available event loop iteration.
 * This is achieved by using `setTimeout` with a delay of 0 milliseconds.
 * @param callback The callback function to be executed.
 */
export const deferExecution = (callback: () => void) => {
  setTimeout(callback, 0)
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
