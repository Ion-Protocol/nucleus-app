import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import { wagmiConfig } from '@/config/wagmi'
import TellerWithMultiAssetSupport from '@/contracts/TellerWithMultiAssetSupport.json'
import { Abi } from 'viem'
import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { getRateInQuote } from '../Accountant/getRateInQuote'
import { allowance } from '../erc20/allowance'
import { approve } from '../erc20/approve'

export async function deposit(
  {
    depositAsset,
    depositAmount,
  }: {
    depositAsset: `0x${string}`
    depositAmount: bigint
  },
  {
    userAddress,
    tellerContractAddress,
    boringVaultAddress,
    accountantAddress,
    chainId,
  }: {
    userAddress: `0x${string}`
    tellerContractAddress: `0x${string}`
    boringVaultAddress: `0x${string}`
    accountantAddress: `0x${string}`
    chainId: number
  }
) {
  ////////////////////////////////
  // Check Allowance
  ////////////////////////////////
  const allowanceAsBigInt = await allowance({
    tokenAddress: depositAsset,
    spenderAddress: boringVaultAddress,
    userAddress,
  })

  ////////////////////////////////
  // Approve
  ////////////////////////////////
  if (depositAmount > allowanceAsBigInt) {
    await approve(
      {
        tokenAddress: depositAsset,
        spenderAddress: boringVaultAddress,
        amount: depositAmount,
      },
      { chainId }
    )
  }

  ////////////////////////////////
  // Calculate Minimum Mint
  ////////////////////////////////
  const rate = await getRateInQuote({ quote: depositAsset }, { contractAddress: accountantAddress })
  const minimumMint = calculateMinimumMint(depositAmount, rate)

  ////////////////////////////////
  // Simulate
  ////////////////////////////////
  await simulateContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: tellerContractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint],
  })

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const txHash = await writeContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: tellerContractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint],
  })

  ////////////////////////////////
  // Wait for Transaction Receipt
  ////////////////////////////////
  const maxRetries = 5
  let attempts = 0

  while (attempts < maxRetries) {
    try {
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash, timeout: 10000 })
      break
    } catch (error) {
      attempts++
      if (attempts === maxRetries) throw error
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return txHash
}
