import { wagmiConfig } from '@/config/wagmi'
import Chainlink from '@/contracts/Chainlink.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

export interface LatestRoundDataResult {
  roundId: bigint
  answer: bigint
  startedAt: bigint
  updatedAt: bigint
  answeredInRound: bigint
}

export async function latestRoundData(contractAddress: `0x${string}`): Promise<LatestRoundDataResult> {
  const [roundId, answer, startedAt, updatedAt, answeredInRound] = (await readContract(wagmiConfig, {
    abi: Chainlink.abi as Abi,
    address: contractAddress,
    functionName: 'latestRoundData',
    args: [],
    chainId: 1,
  })) as bigint[]

  return {
    roundId,
    answer,
    startedAt,
    updatedAt,
    answeredInRound,
  }
}
