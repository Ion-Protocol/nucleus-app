import { TokenIcon } from '@/components/config/tokenIcons'
import { MultiIcon } from '@/components/shared/MulitiIcon'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Collapse, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { RewardsAndHistoryConnector } from './connector'
import { FancyClaimButton } from './FancyClaimButton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import RewardsTable from './RewardsTable'

function RewardsAndHistory({
  networkAssetKey,
  networkAssetName,
  claimableTokenKeys,
  shouldShowRewardsAndHistoryTable,
  shouldDisableClaim,
  claimRewards,
  isClaimPending,
}: RewardsAndHistoryConnector.Props) {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  function toggleCollapse() {
    setIsCollapseOpen((prev) => !prev)
  }

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="border"
      bg="backgroundSecondary"
      borderRadius="8px"
      py={6}
      px={6}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={4}>
          <Text variant="paragraph">Rewards & History</Text>
          <MultiIcon
            icons={claimableTokenKeys.map((tokenKey) => (
              <TokenIcon key={tokenKey} tokenKey={tokenKey} />
            ))}
          />
        </Flex>
        <Flex align="center" gap={2}>
          {/* Big Fancy Claim Button */}
          <FancyClaimButton
            isLoading={isClaimPending}
            isDisabled={shouldDisableClaim}
            pointerEvents={shouldShowRewardsAndHistoryTable ? 'auto' : 'none'}
            networkAssetKey={networkAssetKey}
            networkAssetName={networkAssetName}
            onClick={claimRewards}
          />
          {/* Collapse Button */}
          {shouldShowRewardsAndHistoryTable && (
            <Flex cursor="pointer" onClick={toggleCollapse}>
              {isCollapseOpen && <ChevronUpIcon />}
              {!isCollapseOpen && <ChevronDownIcon />}
            </Flex>
          )}
        </Flex>
      </Flex>
      {shouldShowRewardsAndHistoryTable && (
        <Collapse in={isCollapseOpen} animateOpacity unmountOnExit>
          <Tabs w="100%" borderColor="border" index={selectedTab} onChange={setSelectedTab}>
            {/* Tab Buttons */}
            <TabList>
              <Tab px={0} _selected={{ borderBottom: '2px solid', borderColor: 'text' }}>
                <Text variant="paragraphBold" color={selectedTab === 0 ? 'text' : 'secondaryText'} fontWeight="bold">
                  Rewards
                </Text>
              </Tab>
              <IonTooltip label="Coming soon" aria-label="history">
                <Tab isDisabled _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'text' }}>
                  <Text variant="paragraphBold" color={selectedTab === 1 ? 'text' : 'secondaryText'} fontWeight="bold">
                    History
                  </Text>
                </Tab>
              </IonTooltip>
            </TabList>

            {/* Tabs Content, Mint and Redeem */}
            <TabPanels py={3}>
              <TabPanel p={0}>
                <RewardsTable />
              </TabPanel>
              <TabPanel p={0}>
                <Text>WIP</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Collapse>
      )}
    </Flex>
  )
}

export default RewardsAndHistoryConnector.Connector(RewardsAndHistory)
