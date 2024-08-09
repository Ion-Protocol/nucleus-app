import { wagmiConfig } from '@/config/wagmi'
import CrossChainTellerBaseAbi from '@/contracts/CrossChainTellerBase.json'
import { Abi, Address } from 'viem'
import { readContract } from 'wagmi/actions'

export namespace CrossChainTellerBase {
  export interface BridgeData {
    chainSelector: number
    destinationChainReceiver: Address
    bridgeFeeToken: Address
    messageGas: number
    data: string
  }
}

export async function previewFee(
  { shareAmount, bridgeData }: { shareAmount: bigint; bridgeData: CrossChainTellerBase.BridgeData },
  { contractAddress, chainId }: { contractAddress: Address; chainId: number }
): Promise<bigint> {
  const fee = (await readContract(wagmiConfig, {
    abi: CrossChainTellerBaseAbi.abi as Abi,
    address: contractAddress,
    functionName: 'previewFee',
    args: [shareAmount, bridgeData],
    chainId,
  })) as bigint

  return fee
}
