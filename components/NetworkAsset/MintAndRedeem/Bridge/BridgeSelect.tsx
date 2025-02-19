import { ChainIcon } from '@/components/config/chainIcons'
import { chainsConfig } from '@/config/chains'
import {
  selectBridgeDestinationChain,
  selectBridgeSourceChain,
  selectNetworkAssetConfig,
} from '@/store/slices/networkAssets'
import { ChainKey } from '@/types/ChainKey'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Flex, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { SwitchHorizontal01 } from '@untitled-ui/icons-react'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function BridgeSelect() {
  const dispatch = useDispatch()
  const bridgeSourceChain = useSelector(selectBridgeSourceChain)
  const bridgeDestinationChain = useSelector(selectBridgeDestinationChain)
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)

  // Get available chains from network asset config
  const availableChains = useMemo(() => {
    if (!networkAssetConfig?.bridge) return []
    return Object.keys(networkAssetConfig.bridge) as ChainKey[]
  }, [networkAssetConfig])

  // Set initial source chain to first available chain on mount
  useEffect(() => {
    if (!bridgeSourceChain && availableChains.length > 0) {
      dispatch({ type: 'networkAssets/setBridgeSource', payload: availableChains[0] })
    }
  }, [dispatch, bridgeSourceChain, availableChains])

  const handleSourceChange = (chainKey: ChainKey) => {
    dispatch({ type: 'networkAssets/setBridgeSource', payload: chainKey })
  }

  const handleSwap = () => {
    if (bridgeSourceChain) {
      dispatch({ type: 'networkAssets/setBridgeSource', payload: bridgeDestinationChain })
    }
  }

  return (
    <Flex alignItems={'flex-end'} gap={2}>
      <Flex flexDirection="column" gap={1} w="100%">
        <Text as={'label'} variant="paragraph">
          From
        </Text>
        <Menu matchWidth>
          <MenuButton
            variant="outline"
            borderWidth="1px"
            borderColor="borderLight"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            textAlign="left"
            color={!bridgeSourceChain ? 'disabled' : undefined}
            bg="formBackground"
            _hover={{ bg: 'hoverSecondary' }}
            w="100%"
          >
            <Flex align="center" gap={3}>
              {bridgeSourceChain && <ChainIcon chainKey={bridgeSourceChain} />}
              <Text variant="paragraph">
                {bridgeSourceChain ? chainsConfig[bridgeSourceChain].name : 'Select Chain'}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList bg="backgroundSecondary" w="100%" px={3} border="1px solid" borderColor="border">
            {availableChains.map((chainKey) => (
              <MenuItem
                key={chainKey}
                bg="none"
                onClick={() => handleSourceChange(chainKey)}
                border="1px solid"
                borderColor="transparent"
                _hover={{
                  bg: 'hoverSecondary',
                  border: '1px solid',
                  borderColor: 'border',
                  borderRadius: '8px',
                }}
                py={2}
              >
                <Flex align="center" gap={3}>
                  <ChainIcon chainKey={chainKey} />
                  <Text variant="medium">{chainsConfig[chainKey].name}</Text>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
      <IconButton
        variant={'ghost'}
        aria-label="Swap"
        icon={<Icon as={SwitchHorizontal01} fontSize={'20px'} />}
        onClick={handleSwap}
      />
      <Flex flexDirection="column" gap={1} w="100%">
        <Text as={'label'} variant="paragraph">
          To
        </Text>
        <Menu matchWidth>
          <MenuButton
            variant="outline"
            borderWidth="1px"
            borderColor="borderLight"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            textAlign="left"
            color={!bridgeSourceChain ? 'disabled' : undefined}
            bg="formBackground"
            _hover={{ bg: 'hoverSecondary' }}
            w="100%"
            isDisabled={true}
          >
            <Flex align="center" gap={3}>
              {bridgeDestinationChain && <ChainIcon chainKey={bridgeDestinationChain} />}
              <Text variant="paragraph">
                {bridgeDestinationChain ? chainsConfig[bridgeDestinationChain].name : 'Select Chain'}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList>
            {availableChains.map((chainKey) => (
              <MenuItem key={chainKey} onClick={() => {}} isDisabled>
                <Flex align="center" gap={3}>
                  <ChainIcon chainKey={chainKey} />
                  <Text variant="medium">{chainsConfig[chainKey].name}</Text>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default BridgeSelect
