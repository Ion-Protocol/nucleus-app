import { Box, Button, Image, Text } from '@chakra-ui/react'
import { ConnectButton } from '@funkit/connect'

export function IonConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button variant="solid" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                )
              }
              return (
                <Box style={{ display: 'flex', gap: 12 }}>
                  <Button
                    variant="outline"
                    onClick={openChainModal}
                    leftIcon={
                      <Box bg={chain.iconBackground} borderRadius={999} overflow="hidden">
                        {chain.iconUrl && <Image h="20px" alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} />}
                      </Box>
                    }
                  >
                    <Text variant="button">{chain.name}</Text>
                  </Button>
                  <Button variant="outline" onClick={openAccountModal}>
                    <Text variant="button">
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                    </Text>
                  </Button>
                </Box>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
