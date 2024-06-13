import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { wagmiConfig } from '@/config/wagmi'
import TellerWithMultiAssetSupport from '@/contracts/TellerWithMultiAssetSupport.json'
import { Abi } from 'viem'
import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'

export async function deposit(
  {
    depositAsset,
    depositAmount,
    minimumMint,
  }: {
    depositAsset: string
    depositAmount: bigint
    minimumMint: bigint
  },
  { bridgeKey }: { bridgeKey: BridgeKey }
) {
  const bridge = bridgesConfig[bridgeKey]
  const contractAddress = bridge.contracts.teller

  await simulateContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: contractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint],
  })

  const hash = await writeContract(wagmiConfig, {
    abi: TellerWithMultiAssetSupport.abi as Abi,
    address: contractAddress,
    functionName: 'deposit',
    args: [depositAsset, depositAmount, minimumMint],
  })

  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    hash,
  })

  return receipt
}
