const { BigNumber } = require('ethers')

export const calculateDeadline = (daysFromNow = 3) => {
  // Get current timestamp in seconds
  const now = Math.floor(Date.now() / 1000)

  // Calculate deadline (current time + 3 days in seconds)
  const deadlineSeconds = now + daysFromNow * 24 * 60 * 60

  // Convert to BigNumber and ensure it fits in uint64
  const deadline = BigNumber.from(deadlineSeconds)

  // Validate the deadline fits in uint64 (2^64 - 1)
  const UINT64_MAX = BigNumber.from('18446744073709551615') // 2^64 - 1
  if (deadline.gt(UINT64_MAX)) {
    throw new Error('Deadline exceeds uint64 maximum value')
  }

  return {
    timestamp: deadline.toString(),
    readable: new Date(deadlineSeconds * 1000).toLocaleString(),
    secondsFromNow: deadlineSeconds - now,
  }
}
