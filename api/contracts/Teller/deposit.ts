import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { wagmiConfig } from '@/config/wagmi'
import TellerWithMultiAssetSupport from '@/contracts/TellerWithMultiAssetSupport.json'
import { Abi } from 'viem'
import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { allowance } from '../erc20/allowance'
import { approve } from '../erc20/approve'

export async function deposit(
  {
    depositAsset,
    depositAmount,
    minimumMint,
  }: {
    depositAsset: `0x${string}`
    depositAmount: bigint
    minimumMint: bigint
  },
  { bridgeKey, userAddress }: { bridgeKey: BridgeKey; userAddress: `0x${string}` }
) {
  const bridge = bridgesConfig[bridgeKey]
  const contractAddress = bridge.contracts.teller

  ////////////////////////////////
  // Check Allowance
  ////////////////////////////////
  const allowanceAsBigInt = await allowance({
    tokenAddress: depositAsset,
    spenderAddress: contractAddress,
    userAddress,
  })

  ////////////////////////////////
  // Approve
  ////////////////////////////////
  if (depositAmount > allowanceAsBigInt) {
    await approve({
      tokenAddress: depositAsset,
      spenderAddress: contractAddress,
      amount: depositAmount,
    })
  }

  ////////////////////////////////
  // Simulate
  ////////////////////////////////
  await simulateContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: contractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint],
  })

  ////////////////////////////////
  // Write
  ////////////////////////////////
  const hash = await writeContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: contractAddress,
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
