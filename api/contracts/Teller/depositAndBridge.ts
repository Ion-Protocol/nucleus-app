import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import { wagmiConfig } from '@/config/wagmi'
import CrossChainTellerBaseAbi from '@/contracts/CrossChainTellerBase.json'
import { Abi } from 'viem'
import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { getRateInQuote } from '../Accountant/getRateInQuote'
import { allowance } from '../erc20/allowance'
import { approve } from '../erc20/approve'
import { CrossChainTellerBase } from './previewFee'

export async function depositAndBridge(
  {
    depositAsset,
    depositAmount,
    bridgeData,
  }: {
    depositAsset: `0x${string}`
    depositAmount: bigint
    bridgeData: CrossChainTellerBase.BridgeData
  },
  {
    userAddress,
    tellerContractAddress,
    boringVaultAddress,
    accountantAddress,
  }: {
    userAddress: `0x${string}`
    tellerContractAddress: `0x${string}`
    boringVaultAddress: `0x${string}`
    accountantAddress: `0x${string}`
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
    await approve({
      tokenAddress: depositAsset,
      spenderAddress: boringVaultAddress,
      amount: depositAmount,
    })
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
    abi: CrossChainTellerBaseAbi.abi as Abi,
    address: tellerContractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint, bridgeData],
  })

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const hash = await writeContract(wagmiConfig, {
    abi: CrossChainTellerBaseAbi.abi as Abi,
    address: tellerContractAddress,
    functionName: 'depositAndBridge',
    args: [depositAsset, depositAmount, minimumMint, bridgeData],
  })

  ////////////////////////////////
  // Wait for Transaction Receipt
  ////////////////////////////////
  const { blockHash } = await waitForTransactionReceipt(wagmiConfig, {
    hash,
  })

  return blockHash
}
