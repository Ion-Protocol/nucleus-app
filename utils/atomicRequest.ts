import { Address } from 'viem'

export type AtomicRequestArgs = {
  offer: Address // sharesTokenAddress
  want: Address // wantTokenAddress
  userRequest: UserRequest // userRequest
}

export type AtomicRequestOptions = {
  atomicQueueContractAddress: Address // atomicQueueContractAddress
  chainId: number // destinationChainId
}

export type UserRequest = {
  deadline: bigint // deadline
  atomicPrice: bigint // rateInQuoteWithFee
  offerAmount: bigint // redeemAmount
  inSolve: boolean // false
}

export const prepareAtomicRequestData = (
  deadline: number,
  rateInQuoteWithFee: bigint,
  redeemAmount: bigint,
  sharesTokenAddress: Address,
  wantTokenAddress: Address,
  atomicQueueContractAddress: Address,
  destinationChainId: number
): { atomicRequestArgs: AtomicRequestArgs; atomicRequestOptions: AtomicRequestOptions } => {
  const userRequest = {
    deadline: BigInt(deadline),
    atomicPrice: rateInQuoteWithFee,
    offerAmount: redeemAmount,
    inSolve: false,
  }

  const atomicRequestArgs = {
    offer: sharesTokenAddress,
    want: wantTokenAddress,
    userRequest: userRequest,
  }

  const atomicRequestOptions = {
    atomicQueueContractAddress: atomicQueueContractAddress,
    chainId: destinationChainId,
  }
  return {
    atomicRequestArgs,
    atomicRequestOptions,
  }
}
