import { useDispatch, useSelector } from 'react-redux'
import { setOpen, setSteps, setTitle } from '@/store/slices/stepDialog/slice'
import { IonCard } from '@/components/shared/IonCard'
import {
  Button,
  Divider,
  Flex,
  Input,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { TokenIcon } from '@/components/config/tokenIcons'
import { TokenKey } from '@/types/TokenKey'
import TokenSelect from '../shared/TokenSelect'
import { Token } from '@/types/Token'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import RedeemInput from './RedeemInput'
import { RedeemConnector } from './connector'
import { useState } from 'react'

function Redeem({ inputValue, onChange, error }: RedeemConnector.Props) {
  const [isFocused, setIsFocused] = useState(false)
  const dispatch = useDispatch()
  const dialogState = useSelector((state: any) => state.dialog)
  const tokens = [
    {
      addresses: {
        ethereum: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        sei: '0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8',
      },
      key: 'weth',
      name: 'WETH',
      symbol: 'WETH',
    },
    {
      addresses: { ethereum: '0xbf5495efe5db9ce00f80364c8b423567e58d2110' },
      key: 'ezeth',
      name: 'ezETH',
      symbol: 'EZETH',
    },
    {
      addresses: { ethereum: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0' },
      key: 'wsteth',
      name: 'wstETH',
      symbol: 'WSTETH',
    },
  ]

  // ... existing code ...

  const handleRedeemClick = () => {
    console.log('Redeem button clicked')
    dispatch(setTitle('Redeem Process'))
    dispatch(
      setSteps([
        { id: '1', description: 'Approve token', state: 'completed' },
        { id: '2', description: 'Redeem ssETH', state: 'active' },
        { id: '3', description: 'Receive ETH', state: 'idle' },
      ])
    )
    dispatch(setOpen(true))

    // Debug: Log the updated state
    console.log('Updated dialog state:', dialogState)
  }

  return (
    <Flex direction="column" gap={6}>
      {/* Redeem Input */}
      <IonCard variant="outline" bg="backgroundSecondary" border="1px solid" borderColor="borderLight">
        {/* Top Row */}
        <Flex justify="space-between">
          <Text>Redeem</Text>
          <Flex color="secondaryText" gap={1}>
            <Text variant="smallParagraph">Balance: </Text>
            <IonSkeleton isLoaded={true} minW="25px">
              <Text variant="smallParagraph">{15}</Text>
            </IonSkeleton>
          </Flex>
        </Flex>

        {/* Bottom Row */}
        <Flex align="center" gap={3} mt={3}>
          {/* Input Box */}
          <Flex w="full">
            <IonSkeleton isLoaded={true} minW="250px" w="60%">
              <Input
                value={inputValue}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                variant="unstyled"
                size="lg"
                fontFamily="var(--font-ppformula)"
                fontSize="18px"
                letterSpacing="0.05em"
                placeholder="0"
                color={error ? 'error.main' : 'text'}
              />
              {error && <Text color="error.main">{error}</Text>}
            </IonSkeleton>
          </Flex>

          <Flex gap={2} align="center">
            <TokenIcon fontSize="28px" tokenKey={TokenKey.SSETH} />
            <Text variant="paragraph">ssETH</Text>
          </Flex>
        </Flex>
      </IonCard>

      {/* Redeem Summary */}
      <IonCard variant="outline" bg="formBackground" pt={false ? 3 : 5}>
        {/* Top Row */}
        <Flex justify="space-between" align="center">
          {false ? (
            <Flex
              border="1px solid"
              borderColor="borderLight"
              borderRadius="4px"
              gap={2}
              align="center"
              py={1}
              px={2}
              bg="backgroundAlternate"
            ></Flex>
          ) : (
            <Text variant="smallParagraph" color={false ? 'error.main' : 'text'}>
              Receive
            </Text>
          )}

          <Flex color="secondaryText" gap={1}>
            <>
              <Text variant="smallParagraph">Balance: </Text>
              <IonSkeleton isLoaded={true} minW="25px">
                <Text>{20}</Text>
              </IonSkeleton>
            </>
          </Flex>
        </Flex>

        {/* Bottom Row */}
        <Flex align="center" gap={3} mt={3} justify="space-between">
          {/* Input Box */}
          <Flex direction="column">
            <Input
              value={25}
              variant="unstyled"
              size="lg"
              fontFamily="var(--font-ppformula)"
              fontSize="18px"
              letterSpacing="0.05em"
              placeholder="0"
              color={false ? 'error.main' : 'text'}
            />
            {true && <Text color="error.main">Error Message</Text>}
          </Flex>
          <Flex gap={3} align="center">
            {/* Max Button */}
            <Flex gap={3}>
              <Button
                variant="outline"
                color="secondaryText"
                size="sm"
                onClick={() => {
                  console.log('max')
                }}
              >
                <Text color="disabledText" variant="smallParagraph">
                  MAX
                </Text>
              </Button>
              <Divider orientation="vertical" h="36px" borderColor="border" />
            </Flex>
            {/* Token Select */}
            <TokenSelect
              tokens={tokens as Token[]}
              selected={tokens[0] as Token}
              onChange={() => {
                console.log('change')
              }}
            />
          </Flex>
        </Flex>
      </IonCard>
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
      <Button onClick={handleRedeemClick}>Redeem</Button>
    </Flex>
  )
}

export default RedeemConnector.Connector(Redeem)
