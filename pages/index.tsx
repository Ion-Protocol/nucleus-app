import { IonConnectButton } from '@/components/IonConnectButton.tsx'
import { Box, Button, Link, Text } from '@chakra-ui/react'
import { BaseError, useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

export default function Home() {
  const { data: hash, isPending, sendTransaction, error } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  const { isConnected } = useAccount()

  const sendTx = async () => {
    sendTransaction({ to: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' })
  }

  return (
    <Box m={10} overflowX="auto">
      <IonConnectButton />
      <Button hidden={!isConnected} onClick={sendTx} isLoading={isPending}>
        Send Test Transaction
      </Button>
      {hash && <Text>Transaction Hash: {hash}</Text>}
      {hash && (
        <Link
          href={`https://dashboard.tenderly.co/ion-protocol/money-market-v1/testnet/71701faf-e853-4997-979e-51d7c3968d54/tx/mainnet/${hash}`}
        >
          Click for Tx on Tenderly
        </Link>
      )}

      {isConfirming && <Text>Waiting for confirmation...</Text>}
      {isConfirmed && <Text>Transaction confirmed.</Text>}
      {error && <Text>Error: {(error as BaseError).shortMessage || error.message}</Text>}
    </Box>
  )
}
