import { TokenUsdIcon } from '@/components/shared/icons/TokenUsd'
import { Currency } from '@/types/Currency'
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { CurrencySelectConnector } from './connector'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { EthereumIcon } from '@/components/shared/icons/Ethereum'

export const currencyIconMap: Record<Currency, React.ReactElement> = {
  [Currency.USD]: <TokenUsdIcon />,
  [Currency.ETH]: <EthereumIcon />,
}

function CurrencySelect({ currency, setCurrency }: CurrencySelectConnector.Props) {
  const currencyList = Object.values(Currency)

  function handleChange(curr: Currency) {
    setCurrency(curr)
  }

  return (
    <Menu>
      <MenuButton as={Button} variant="outline" leftIcon={currencyIconMap[currency]} rightIcon={<ChevronDownIcon />}>
        <Text fontSize="15px" fontWeight="normal" fontFamily="var(--font-recklessNeue)">
          {currency}
        </Text>
      </MenuButton>
      <MenuList bg="backgroundSecondary">
        {currencyList.map((curr) => (
          <Flex key={curr} align="center" pl={3} _hover={{ bg: 'hoverSecondary' }}>
            {currencyIconMap[curr]}
            <MenuItem bg="none" onClick={() => handleChange(curr as Currency)}>
              {curr}
            </MenuItem>
          </Flex>
        ))}
      </MenuList>
    </Menu>
  )
}

export default CurrencySelectConnector.Connector(CurrencySelect)
