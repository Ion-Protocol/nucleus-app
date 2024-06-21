import { NetApyItem } from '@/types/NetApyItem'

/**
 * Generates a Gaussian kernel of a specified size and standard deviation (sigma).
 * The kernel weights are normalized so that their sum equals 1.
 * @param {number} size - The size of the Gaussian kernel.
 * @param {number} sigma - The standard deviation of the Gaussian distribution.
 * @returns {number[]} - The generated Gaussian kernel.
 */
function gaussianKernel(size: number, sigma: number): number[] {
  const kernel = []
  const mean = size / 2
  let sum = 0

  for (let i = 0; i < size; i++) {
    kernel[i] = Math.exp(-0.5 * Math.pow((i - mean) / sigma, 2))
    sum += kernel[i]
  }

  // Normalize the kernel
  return kernel.map((value) => value / sum)
}

/**
 * Applies Gaussian smoothing to the `netApy` values in the data.
 * The Gaussian kernel is used to compute a weighted sum of the `netApy` values,
 * producing a smoothed result.
 * @param {NetApyItem[]} data - The array of NetApyItem objects to be smoothed.
 * @param {number} kernelSize - The size of the Gaussian kernel.
 * @param {number} sigma - The standard deviation of the Gaussian distribution.
 * @returns {NetApyItem[]} - The smoothed array of NetApyItem objects.
 */
export function applyGaussianSmoothing(data: NetApyItem[], kernelSize: number, sigma: number): NetApyItem[] {
  if (data.length === 0) return []

  const kernel = gaussianKernel(kernelSize, sigma)
  const halfSize = Math.floor(kernelSize / 2)
  const smoothedData: NetApyItem[] = []

  for (let i = 0; i < data.length; i++) {
    let weightedSum = 0
    let weightTotal = 0

    for (let j = 0; j < kernelSize; j++) {
      const dataIndex = i + j - halfSize
      if (dataIndex >= 0 && dataIndex < data.length) {
        weightedSum += data[dataIndex].netApy * kernel[j]
        weightTotal += kernel[j]
      }
    }

    const smoothedNetApy = weightedSum / weightTotal
    smoothedData.push({ ...data[i], netApy: smoothedNetApy })
  }

  return smoothedData
}
