import Decimal from 'decimal.js'

/**
 * Calculates the utilization rate based on the total supply and liquidity.
 *
 * @param totalSupply - The total supply of a resource.
 * @param liquidity - The amount of liquidity available.
 * @returns The utilization rate as a bigint.
 */
export function calculateUtilizationRate(totalSupply: bigint, liquidity: bigint): number {
  const totalSupplyNumber = Number(totalSupply) / 1e18
  const totalLiquidityNumber = Number(liquidity) / 1e18
  if (totalSupplyNumber === 0) return 0
  return ((totalSupplyNumber - totalLiquidityNumber) / totalSupplyNumber) * 100
}

export function perSecondToAnnualRate(val: bigint, scale: number, dec: number): number {
  return new Decimal(val.toString()).dividedBy(new Decimal(1e27)).pow(31536000).sub(1).toNumber()
}

export function calculateApy(borrowRate: number, lenderAssetApy: number, utilizationRate: number) {
  const lenderApy = (1 + borrowRate) * (1 + lenderAssetApy / 100) - 1
  return lenderApy * utilizationRate
}
