import { Box, Button, Image, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

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
                return <Button onClick={openConnectModal}>Connect Wallet</Button>
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                )
              }
              return (
                <Box style={{ display: 'flex', gap: 12 }}>
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    leftIcon={
                      <Box bg={chain.iconBackground} borderRadius={999} overflow="hidden">
                        {chain.iconUrl && (
                          <Image
                            h="20px"
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            fallbackSrc="defaultIconUrl"
                          />
                        )}
                      </Box>
                    }
                  >
                    <Text variant="medium">{chain.name}</Text>
                  </Button>
                  <Button variant="outline" onClick={openAccountModal}>
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
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
