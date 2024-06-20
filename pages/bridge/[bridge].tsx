import BridgeChart from '@/components/Bridge/BridgeChart'
import { BridgeForm } from '@/components/Bridge/BridgeForm'
import BridgeTitle from '@/components/Bridge/BridgeTitle'
import MarketsTable from '@/components/Bridge/MarketsTable'
import { Flex } from '@chakra-ui/react'

export default function Bridge() {
  return (
    <Flex direction="column" h="100%">
      {/* Title & Description */}
      <Flex direction="column" h="150px" borderBottom="1px solid" borderColor="border" justify="center">
        <BridgeTitle mx={9} />
      </Flex>

      {/* Bottom */}
      <Flex h="100%">
        {/* Left: Main Bridge Form */}
        <BridgeForm px={9} pt={9} w="40%" minW="300px" borderRight="1px solid" borderColor="border" />

        {/* Right: Chart and Markets Table */}
        <Flex direction="column" w="60%" p={6}>
          <BridgeChart />
          <Flex h={9} />
          <MarketsTable />
        </Flex>
      </Flex>
    </Flex>
  )
}
