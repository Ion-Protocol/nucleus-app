import { wagmiConfig } from '@/config/wagmi'
import GasRouterAbi from '@/contracts/GasRouter.json'
import { Abi, Address } from 'viem'
import { readContract } from 'wagmi/actions'

export async function quoteGasPayment(
  { destinationDomain }: { destinationDomain: number },
  { contractAddress }: { contractAddress: Address }
): Promise<bigint> {
  const gasPayment = (await readContract(wagmiConfig, {
    abi: GasRouterAbi.abi as Abi,
    address: contractAddress,
    functionName: 'quoteGasPayment',
    args: [destinationDomain],
    chainId: 1,
  })) as bigint

  return gasPayment
}
