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
    fee,
  }: {
    userAddress: `0x${string}`
    tellerContractAddress: `0x${string}`
    boringVaultAddress: `0x${string}`
    accountantAddress: `0x${string}`
    fee: bigint
  }
): Promise<`0x${string}`> {
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
      { chainId: 1 }
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
    abi: CrossChainTellerBaseAbi.abi as Abi,
    address: tellerContractAddress,
    functionName: 'depositAndBridge',
    args: [depositAsset, depositAmount, minimumMint, bridgeData],
    chainId: 1,
    value: fee,
  })

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const txHash = await writeContract(wagmiConfig, {
    abi: CrossChainTellerBaseAbi.abi as Abi,
    address: tellerContractAddress,
    functionName: 'depositAndBridge',
    args: [depositAsset, depositAmount, minimumMint, bridgeData],
    chainId: 1,
    value: fee,
  })

  ////////////////////////////////
  // Wait for Transaction Receipt
  ////////////////////////////////
  await waitForTransactionReceipt(wagmiConfig, {
    hash: txHash,
    timeout: 60_000,
    confirmations: 1,
    pollingInterval: 10_000,
    retryCount: 5,
    retryDelay: 5_000,
  })

  return txHash
}
