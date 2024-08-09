import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { Mint } from './Mint'
import { Redeem } from './Redeem'

export function MintAndRedeem() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <Flex border="1px solid" borderColor="border" bg="table.background" borderRadius="8px" py={6} px={6}>
      <Tabs w="100%" borderColor="border" index={selectedIndex} onChange={setSelectedIndex}>
        {/* Tab Buttons */}
        <TabList>
          <Tab _selected={{ borderBottom: '2px solid', borderColor: 'text' }}>
            <Text variant="large" color={selectedIndex === 0 ? 'text' : 'secondaryText'} fontWeight="bold">
              Mint
            </Text>
          </Tab>
          <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'text' }}>
            <Text variant="large" color={selectedIndex === 1 ? 'text' : 'secondaryText'} fontWeight="bold">
              Redeem
            </Text>
          </Tab>
        </TabList>

        {/* Tabs Content, Mint and Redeem */}
        <TabPanels>
          <TabPanel>
            <Mint />
          </TabPanel>
          <TabPanel>
            <Redeem />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
