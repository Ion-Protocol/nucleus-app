import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Accordion, AccordionItem, Flex, AccordionButton, AccordionIcon, AccordionPanel, Text } from '@chakra-ui/react'
import React from 'react'
import { RedeemSummaryConnector } from './connector'

function RedeemSummary() {
  return (
    <>
      <Accordion allowToggle>
        <AccordionItem borderTop="none">
          <Flex direction="column" gap={3} pb={3}>
            <AccordionButton _hover={{ bg: 'none' }} padding={0}>
              {/* <Box as="span" flex="1"> */}
              <Flex align="center" justify="space-between" flex="1">
                <Flex color="secondaryText" gap={2} align="center">
                  <Text variant="paragraph" color="disabledText">
                    Price
                  </Text>
                  <IonTooltip label={'Price Label'}>
                    <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                  </IonTooltip>
                </Flex>
                <IonSkeleton minW="75px" isLoaded={true}>
                  <Flex align="center">
                    <Text textAlign="right" variant="paragraph">
                      1.1 ETH / seiyanETH
                    </Text>
                    <AccordionIcon />
                  </Flex>
                </IonSkeleton>
              </Flex>
              {/* </Box> */}
            </AccordionButton>
            <Flex align="center" justify="space-between">
              <Flex color="secondaryText" gap={2} align="center">
                <Text variant="paragraph" color="disabledText">
                  Fees
                </Text>
                <IonTooltip label={'Testing Label'}>
                  <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                </IonTooltip>
              </Flex>
              <IonSkeleton minW="75px" isLoaded={true}>
                <Text textAlign="right" variant="paragraph">
                  0.05 ETH
                </Text>
              </IonSkeleton>
            </Flex>
          </Flex>
          <AccordionPanel paddingX={0} paddingTop={1} paddingBottom={3}>
            <Flex direction="column" gap={3}>
              <Flex align="center" justify="space-between">
                <Flex color="secondaryText" gap={2} align="center">
                  <Text variant="paragraph" color="disabledText">
                    Deadline
                  </Text>
                  <IonTooltip label={'Testing Label'}>
                    <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                  </IonTooltip>
                </Flex>
                <IonSkeleton minW="75px" isLoaded={true}>
                  <Text textAlign="right" variant="paragraph">
                    3 days
                  </Text>
                </IonSkeleton>
              </Flex>
              <Flex align="center" justify="space-between">
                <Flex color="secondaryText" gap={2} align="center">
                  <Text variant="paragraph" color="disabledText">
                    Maximum Slippage
                  </Text>
                  <IonTooltip label={'Testing Label'}>
                    <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                  </IonTooltip>
                </Flex>
                <IonSkeleton minW="75px" isLoaded={true}>
                  <Text textAlign="right" variant="paragraph">
                    0.5%
                  </Text>
                </IonSkeleton>
              </Flex>
              <Flex align="center" justify="space-between">
                <Flex color="secondaryText" gap={2} align="center">
                  <Text variant="paragraph" color="disabledText">
                    Received at least
                  </Text>
                  <IonTooltip label={'Testing Label'}>
                    <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
                  </IonTooltip>
                </Flex>
                <IonSkeleton minW="75px" isLoaded={true}>
                  <Text textAlign="right" variant="paragraph">
                    1.05 ETH
                  </Text>
                </IonSkeleton>
              </Flex>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Flex align="center" justify="space-between">
        <Flex color="secondaryText" gap={2} align="center">
          <Text variant="paragraph" color="disabledText">
            Total
          </Text>
          <IonTooltip label={'Testing Label'}>
            <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
          </IonTooltip>
        </Flex>
        <IonSkeleton minW="75px" isLoaded={true}>
          <Text textAlign="right" variant="paragraph">
            $23.43
          </Text>
        </IonSkeleton>
      </Flex>
    </>
  )
}

export default RedeemSummaryConnector.Connector(RedeemSummary)
