export const calculateRedeemDeadline = (daysFromNow = 7): number => {
  // Get days in seconds
  const daysInSeconds = daysFromNow * 24 * 60 * 60

  // Get current timestamp in seconds
  const currentTimeStamp = Math.floor(Date.now() / 1000)

  // Calculate deadline (current time + 7 days in seconds)
  const deadline = currentTimeStamp + daysInSeconds

  return deadline
}
