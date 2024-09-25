import { transferRemote } from '@/api/contracts/TokenRouter/transferRemote'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import NetworkAssetList from '@/components/NetworkAssetList'
import { Button, Flex, Text } from '@chakra-ui/react'
import { Connection, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import { toHex } from 'viem/utils'
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token'

const eclipseId = 1408864445
const userAddress = '0x94544835Cf97c631f101c5f538787fE14E2E04f6'
const solanaAddress = 'GX8YP1ej1L2A5nbBswTuaMGYJZWVtTHVmdhG3j6fWMLN'
const tokenRouterContractAddress = '0xc2495f3183F043627CAECD56dAaa726e3B2D9c09'
const tEthEthereumAddress = '0x19e099B7aEd41FA52718D780dDA74678113C0b32'
const tEthSolanaMintAddress = 'GU7NS9xCwgNPiAdJ69iusFrRfawjDDPjeMBovhV1d4kn'
const rpcUrl = 'https://mainnetbeta-rpc.eclipse.xyz'

export default function Dashboard() {
  async function handleTransferRemote() {
    const decodedAddress = bs58.decode(solanaAddress)
    const recipientBytes32 = toHex(decodedAddress, { size: 32 })
    console.log('🚀 ~ handleClick ~ recipientBytes32:', recipientBytes32)

    await transferRemote(
      {
        destination: eclipseId,
        recipient: recipientBytes32,
        amount: BigInt('100000000000000'),
      },
      {
        userAddress,
        tokenRouterAddress: tokenRouterContractAddress,
        bridgeAsset: tEthEthereumAddress,
      }
    )
  }

  async function handleGetTokenBalance(): Promise<number> {
    const connection = new Connection(rpcUrl, 'confirmed')

    // Create PublicKey objects
    const wallet = new PublicKey(solanaAddress)
    const tokenMint = new PublicKey(tEthSolanaMintAddress)

    // Fetch all token accounts associated with the wallet and mint
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
      mint: tokenMint,
    })

    console.log('🚀 ~ handleGetTokenBalance ~ tokenAccounts:', tokenAccounts)

    // Initialize balance
    let balance = 0

    // Accumulate the balance from each token account
    tokenAccounts.value.forEach((accountInfo) => {
      const tokenAmount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount
      balance += tokenAmount // This is the final user-friendly balance
    })

    console.log('finalBalance: ', balance)
    return balance
  }

  return (
    <Flex p={9} pr={3} direction="column" pb="150px">
      <Button onClick={handleTransferRemote}>transferRemote</Button>
      <Button onClick={handleGetTokenBalance}>getTokenBalance</Button>
      {/* Page title */}
      <Flex direction="column" gap={1}>
        <Text data-testid="dashboard-title" variant="heading2">
          Dashboard
        </Text>
        <Text variant="smallParagraph">Explore the networks powered by Nucleus.</Text>
      </Flex>

      <Flex h={9} />

      {/* Big announcement banner */}
      <Flex pr={6}>
        <AnnouncementBanner />
      </Flex>

      <Flex h={16} />

      {/* Network asset list */}
      <Text variant="heading2">Select a Network Asset</Text>
      <Flex h={8} />
      <NetworkAssetList />
    </Flex>
  )
}
