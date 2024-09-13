import { ChainIcon } from '@/components/config/chainIcons'
import { PointSystemIcon } from '@/components/config/pointSystemIcons'
import { MultiIcon } from '@/components/shared/MulitiIcon'
import { Flex } from '@chakra-ui/react'
import { RewardsIconRowConnector } from './connector'

function RewardsIconRow({ incentiveChainKeys, pointSystemKeys, chainKey, ...props }: RewardsIconRowConnector.Props) {
  return (
    <Flex align="center" {...props}>
      <MultiIcon
        icons={incentiveChainKeys
          .map((incentiveChainKey) => <ChainIcon key={incentiveChainKey} chainKey={incentiveChainKey} />)
          .concat(
            pointSystemKeys.map((pointSystemKey) => (
              <PointSystemIcon key={pointSystemKey} pointSystemKey={pointSystemKey} />
            ))
          )}
      />
    </Flex>
  )
}

export default RewardsIconRowConnector.Connector(RewardsIconRow)
