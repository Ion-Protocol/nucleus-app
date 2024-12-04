import { wagmiConfig } from '@/config/wagmi'
import { selectNetworkId } from '@/store/slices/chain'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
// import { useAccount } from 'wagmi'
import { switchChain } from 'wagmi/actions'

export const useChainManagement = () => {
  const networkId = useSelector(selectNetworkId) // Id of chain user is connected to
  // const { chainId } = useAccount() // commented out but left incase switch to wagmi hooks is made

  const switchToChain = useCallback(
    async (targetChainId: number) => {
      //   if (chain?.id !== targetChainId) {
      // if (networkId !== targetChainId) {
      try {
        await switchChain(wagmiConfig, { chainId: targetChainId })
      } catch (error) {
        throw new Error('Failed to switch to the correct network. Please switch manually and try again.')
      }
      // }
    },
    // [chain]
    // [networkId]
    []
  )

  return {
    switchToChain,
    // currentChainId: chain?.id,
    currentChainId: networkId,
  }
}
