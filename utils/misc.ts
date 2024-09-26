import { PublicKey } from '@solana/web3.js'

/**
 * Defers the execution of a callback function to the next available event loop iteration.
 * This is achieved by using `setTimeout` with a delay of 0 milliseconds.
 * @param callback The callback function to be executed.
 */
export const deferExecution = (callback: () => void) => {
  setTimeout(callback, 0)
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Validates if the provided string is a valid Solana address.
 * @param address - The Solana address string to validate.
 * @returns true if the address is valid, false otherwise.
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    // Try to create a PublicKey instance, which will throw an error if invalid
    new PublicKey(address)
    return true
  } catch (error) {
    return false
  }
}
