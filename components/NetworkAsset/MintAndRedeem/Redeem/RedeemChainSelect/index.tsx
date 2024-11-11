import { ChainIcon } from '@/components/config/chainIcons'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { ChainKey } from '@/types/ChainKey'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectRedeemSourceChains,
  selectRedeemDestinationChains,
  setRedeemSourceChain,
  setRedeemDestinationChain,
} from '@/store/slices/networkAssets'
import { RootState } from '@/store'
import { useEffect } from 'react'

interface RedeemChainSelectProps {
  role: 'source' | 'destination'
  isActive: boolean
}

function RedeemChainSelect({ role, isActive }: RedeemChainSelectProps) {
  const dispatch = useDispatch()

  // Get the current chain values directly from state
  const redeemSourceChain = useSelector((state: RootState) => state.networkAssets.redeemSourceChain)
  const redeemDestinationChain = useSelector((state: RootState) => state.networkAssets.redeemDestinationChain)

  // Get available chains
  const availableSourceChains = useSelector(selectRedeemSourceChains)
  const availableDestinationChains = useSelector(selectRedeemDestinationChains)

  // Get the current chain based on role
  const currentChain = role === 'source' ? redeemSourceChain : redeemDestinationChain

  // Get the appropriate chains based on role
  const chains = role === 'source' ? availableSourceChains : availableDestinationChains

  useEffect(() => {
    // Only set default for source chain if it's null
    if (role === 'source' && redeemSourceChain === null && availableSourceChains.length > 0) {
      dispatch(setRedeemSourceChain(availableSourceChains[0].key))
    }
  }, [role, availableSourceChains, redeemSourceChain, dispatch])

  const handleChainChange = (chainKey: ChainKey) => {
    if (role === 'source') {
      dispatch(setRedeemSourceChain(chainKey))
    } else {
      dispatch(setRedeemDestinationChain(chainKey))
    }
  }

  // Define placeholder text based on role
  const placeholder =
    role === 'source' ? 'Select source chain for redemption' : 'Select destination chain for redemption'

  // Find the current chain details
  const selectedChain = chains.find((chain) => chain.key === currentChain)
  const primaryText = selectedChain ? selectedChain.name : placeholder

  return (
    <Menu matchWidth>
      <MenuButton
        variant="outline"
        borderWidth="1px"
        borderColor={role === 'destination' ? 'border' : 'borderLight'}
        as={Button}
        rightIcon={isActive ? <ChevronDownIcon /> : undefined}
        textAlign="left"
        color={!currentChain ? 'disabled' : undefined}
        bg={role === 'destination' ? 'none' : 'formBackground'}
        pointerEvents={isActive ? 'auto' : 'none'}
        _hover={isActive ? { bg: 'hoverSecondary' } : undefined}
        w="100%"
      >
        <Flex align="center" gap={3}>
          {currentChain && <ChainIcon chainKey={currentChain} />}
          <Text variant="paragraph">{primaryText}</Text>
        </Flex>
      </MenuButton>

      <MenuList bg="backgroundSecondary" w="100%" px={3} border="1px solid" borderColor="border">
        {chains.map((chain) => (
          <MenuItem
            key={chain.key}
            bg="none"
            onClick={() => handleChainChange(chain.key)}
            border="1px solid"
            borderColor="transparent"
            isDisabled={!isActive}
            _hover={{
              bg: 'hoverSecondary',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: '8px',
            }}
            py={2}
          >
            <Flex align="center" gap={3}>
              <ChainIcon chainKey={chain.key} />
              <Text variant="medium">{chain.name}</Text>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default RedeemChainSelect
