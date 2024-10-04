import { wagmiConfig } from '@/config/wagmi'
import AccountantWithRateProviders from '@/contracts/AccountantWithRateProviders.json'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'

type RawAccountantState = [
  `0x${string}`, // payoutAddress
  bigint, // feesOwedInBase
  bigint, // totalSharesLastUpdate
  number, // exchangeRate
  number, // allowedExchangeRateChangeUpper
  number, // allowedExchangeRateChangeLower
  number, // lastUpdateTimestamp
  boolean, // isPaused
  number, // minimumUpdateDelayInSeconds
  number, // managementFee
]

type TransformedAccountantState = {
  payoutAddress: `0x${string}`
  feesOwedInBase: bigint
  totalSharesLastUpdate: bigint
  exchangeRate: number
  allowedExchangeRateChangeUpper: number
  allowedExchangeRateChangeLower: number
  lastUpdateTimestamp: number
  isPaused: boolean
  minimumUpdateDelayInSeconds: number
  managementFee: number
}

export async function accountantState(contractAddress: `0x${string}`): Promise<TransformedAccountantState> {
  const state = (await readContract(wagmiConfig, {
    abi: AccountantWithRateProviders.abi as Abi,
    address: contractAddress,
    functionName: 'accountantState',
    args: [],
    chainId: 1,
  })) as RawAccountantState

  const [
    payoutAddress,
    feesOwedInBase,
    totalSharesLastUpdate,
    exchangeRate,
    allowedExchangeRateChangeUpper,
    allowedExchangeRateChangeLower,
    lastUpdateTimestamp,
    isPaused,
    minimumUpdateDelayInSeconds,
    managementFee,
  ] = state

  return {
    payoutAddress,
    feesOwedInBase,
    totalSharesLastUpdate,
    exchangeRate,
    allowedExchangeRateChangeUpper,
    allowedExchangeRateChangeLower,
    lastUpdateTimestamp,
    isPaused,
    minimumUpdateDelayInSeconds,
    managementFee,
  }
}
