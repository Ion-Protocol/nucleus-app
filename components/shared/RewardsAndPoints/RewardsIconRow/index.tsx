import { PointSystemIcon } from '@/components/config/pointSystemIcons'
import { TokenIcon } from '@/components/config/tokenIcons'
import { MultiIcon } from '@/components/shared/MulitiIcon'
import { Flex } from '@chakra-ui/react'
import { RewardsIconRowConnector } from './connector'

function RewardsIconRow({ apyTokenKeys, pointSystemKeys, tokenKey, ...props }: RewardsIconRowConnector.Props) {
  return (
    <Flex align="center" {...props}>
      <MultiIcon
        icons={apyTokenKeys
          .map((apyTokenKey) => <TokenIcon key={apyTokenKey} tokenKey={apyTokenKey} />)
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
