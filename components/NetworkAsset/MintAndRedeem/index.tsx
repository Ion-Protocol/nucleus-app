import { IonTooltip } from '@/components/shared/IonTooltip'
import { selectNetworkAssetConfig } from '@/store/slices/networkAssets'
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Bridge } from './Bridge'
import { Mint } from './Mint'
import { Redeem } from './Redeem'

export function MintAndRedeem() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)

  return (
    <Flex w="660px" border="1px solid" borderColor="border" bg="backgroundSecondary" borderRadius="8px" py={6} px={6}>
      <Tabs w="100%" borderColor="border" index={selectedIndex} onChange={setSelectedIndex}>
        {/* Tab Buttons */}
        <TabList>
          <Tab _selected={{ borderBottom: '2px solid', borderColor: 'text' }}>
            <Text variant="paragraph" color={selectedIndex === 0 ? 'text' : 'secondaryText'}>
              Mint
            </Text>
          </Tab>
          {networkAssetConfig?.redeemComingSoon ? (
            <IonTooltip label="Coming soon < 1 week" aria-label="Redeem tab tooltip">
              <Tab isDisabled _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'text' }}>
                <Text variant="paragraph" color={selectedIndex === 1 ? 'text' : 'secondaryText'}>
                  Redeem
                </Text>
              </Tab>
            </IonTooltip>
          ) : (
            <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'text' }}>
              <Text variant="paragraph" color={selectedIndex === 1 ? 'text' : 'secondaryText'}>
                Redeem
              </Text>
            </Tab>
          )}
          {networkAssetConfig?.allowBridge && (
            <Tab _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'text' }}>
              <Text variant="paragraph" color={selectedIndex === 2 ? 'text' : 'secondaryText'}>
                Bridge
              </Text>
            </Tab>
          )}
        </TabList>

        {/* Tabs Content, Mint and Redeem */}
        <TabPanels py={3}>
          <TabPanel>
            <Mint />
          </TabPanel>
          <TabPanel>
            <Redeem />
          </TabPanel>
          <TabPanel>
            <Bridge />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
