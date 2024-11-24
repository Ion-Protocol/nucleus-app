import { Address } from 'viem'

export type AtomicRequestArgs = {
  offer: Address
  want: Address
  userRequest: UserRequest
}

export type AtomicRequestOptions = {
  atomicQueueContractAddress: Address
  chainId: number
}

export type UserRequest = {
  deadline: bigint
  atomicPrice: bigint
  offerAmount: bigint
  inSolve: boolean
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
