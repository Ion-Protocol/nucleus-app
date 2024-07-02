import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import { BridgeKey, bridgesConfig } from '@/config/bridges'
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
  { bridgeKey, userAddress }: { bridgeKey: BridgeKey; userAddress: `0x${string}` }
) {
  const bridge = bridgesConfig[bridgeKey]
  const callingContractAddress = bridge.contracts.teller
  const allowanceContractAddress = bridge.contracts.boringVault

  ////////////////////////////////
  // Check Allowance
  ////////////////////////////////
  const allowanceAsBigInt = await allowance({
    tokenAddress: depositAsset,
    spenderAddress: allowanceContractAddress,
    userAddress,
  })

  ////////////////////////////////
  // Approve
  ////////////////////////////////
  if (depositAmount > allowanceAsBigInt) {
    await approve({
      tokenAddress: depositAsset,
      spenderAddress: allowanceContractAddress,
      amount: depositAmount,
    })
  }

  ////////////////////////////////
  // Calculate Minimum Mint
  ////////////////////////////////
  const rate = await getRateInQuote({ quote: depositAsset }, { bridgeKey })
  const minimumMint = calculateMinimumMint(depositAmount, rate)

  ////////////////////////////////
  // Simulate
  ////////////////////////////////
  await simulateContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: callingContractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint],
  })

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const hash = await writeContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: callingContractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint],
  })

  ////////////////////////////////
  // Wait for Transaction Receipt
  ////////////////////////////////
  const { blockHash } = await waitForTransactionReceipt(wagmiConfig, {
    hash,
  })

  return blockHash
}
