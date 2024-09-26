import { msInOneYear } from '@/config/constants'
import { TokenApyDataItem } from '@/types/Chain'
import { formatUnits } from 'viem'

export function calculateApy(apyData: TokenApyDataItem[], tvlInEthAsBigInt: bigint, usdPerEthRate: bigint): number {
  if (tvlInEthAsBigInt === BigInt(0)) return 0
  if (apyData.length === 0) return 0

  const now = Date.now()
  const apyDataItem = apyData.find((apyDataItem) => {
    if (now > apyDataItem.startDate && now < apyDataItem.endDate) {
      return apyDataItem
    }
  })

  if (!apyDataItem) return 0

  const distribution = apyDataItem.distribution
  const timeRangeInMs = apyDataItem.endDate - apyDataItem.startDate
  const tvlInUsdAsBigInt = (usdPerEthRate * tvlInEthAsBigInt) / BigInt(1e8)
  const tvlInUsdAsNumber = parseFloat(formatUnits(tvlInUsdAsBigInt, 18))

  const annualizedTotalReward = distribution * (msInOneYear / timeRangeInMs)
  const apy = (annualizedTotalReward / tvlInUsdAsNumber) * 100
  return apy
}
