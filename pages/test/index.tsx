import { deposit } from '@/api/contracts/Teller/deposit'
import { approve } from '@/api/contracts/erc20/approve'
import { BridgeKey } from '@/config/bridges'
import { TokenKey, tokensConfig } from '@/config/token'
import { wagmiConfig } from '@/config/wagmi'
import { Button, Flex } from '@chakra-ui/react'
import { erc20Abi } from 'viem'
import { readContract } from 'wagmi/actions'

// allowance = await publicClient.readContract({
//   abi: erc20Abi,
//   address: contractAddress as `0x${string}`,
//   functionName: 'allowance',
//   args: [account as `0x${string}`, spender as `0x${string}`],
// })

export default function Test() {
  async function handleSend() {
    try {
      const receipt = await deposit(
        {
          depositAsset: tokensConfig[TokenKey.WSTETH].address,
          depositAmount: BigInt(1e18),
          minimumMint: BigInt(5e18),
        },
        { bridgeKey: BridgeKey.ARBITRUM }
      )

      console.log('🚀 ~ Transaction confirmed ~ receipt:', receipt)
    } catch (error) {
      console.error('🚀 ~ Transaction error ~', error)
    }
  }

  async function handleRead() {
    const result = await readContract(wagmiConfig, {
      abi: erc20Abi,
      address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      functionName: 'allowance',
      args: ['0x5e6d7C88f4Be6387f0a9006562d10f8d1C89e84E', '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3'],
    })
    console.log('🚀 ~ handleRead ~ result:', result)
  }

  async function handleApprove() {
    try {
      const receipt = await approve({
        tokenAddress: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        spenderAddress: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
        amount: BigInt(2e18),
      })

      console.log('🚀 ~ Transaction confirmed ~ receipt:', receipt)
    } catch (error) {
      console.error('🚀 ~ Transaction error ~', error)
    }
  }

  return (
    <Flex p={9} direction="column">
      <Button w="fit-content" onClick={handleSend}>
        Send Transaction
      </Button>
      <Button w="fit-content" onClick={handleRead}>
        Allowance
      </Button>
      <Button w="fit-content" onClick={handleApprove}>
        Approve
      </Button>
    </Flex>
  )
}
