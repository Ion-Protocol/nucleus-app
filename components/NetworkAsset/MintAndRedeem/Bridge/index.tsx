import { ConnectAwareButton } from '@/components/shared/ConnectAwareButton'
import { RootState } from '@/store'
import {
  selectBridgeAmount,
  selectBridgeDataForBridge,
  selectBridgeDestinationChainId,
  selectBridgeDestinationChainKey,
  selectBridgeSourceChainKey,
  selectContractAddressByName,
} from '@/store/slices/networkAssets'
import { ChakraProps, Flex, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import BridgeInput from './BridgeInput'
import BridgeSelect from './BridgeSelect'

export function Bridge({ ...props }: ChakraProps) {
  const bridgeSourceChainKey = useSelector(selectBridgeSourceChainKey)
  const bridgeDestinationChainKey = useSelector(selectBridgeDestinationChainKey)
  const bridgeAmount = useSelector(selectBridgeAmount)
  const bridgeData = useSelector(selectBridgeDataForBridge)
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const bridgeDestinationChainId = useSelector(selectBridgeDestinationChainId)
  console.log('bridgeData', bridgeData)
  // const { data: previewFee } = useGetPreviewFeeQuery(
  //   {
  //     shareAmount: BigInt(bridgeAmount),
  //     bridgeData: bridgeData!,
  //     contractAddress: accountantAddress!,
  //     chainId: bridgeDestinationChainId!,
  //   },
  //   { skip: !bridgeData || !accountantAddress || !bridgeDestinationChainId }
  // )
  // console.log('previewFee', previewFee)
  return (
    <Flex direction="column" {...props} gap={6}>
      <BridgeSelect />
      <BridgeInput />

      <ConnectAwareButton
        h="fit-content"
        p={2}
        gap={1}
        // isLoading={loading}
        // onClick={handleClickSubmit}
        // isDisabled={disabled}
        // _hover={!loading && !disabled ? {} : undefined}
        // _active={!loading && !disabled ? {} : undefined}
      >
        <Text variant="button">Bridge</Text>
      </ConnectAwareButton>
    </Flex>
  )
}
