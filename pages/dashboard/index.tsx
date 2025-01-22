import NetworkAssetList from '@/components/NetworkAssetList'
import { useAppSelector } from '@/store/hooks'
import { selectFormattedTotalTvl, selectNetworkCount } from '@/store/slices/networkAssets'
import { useGetTvlQuery } from '@/store/slices/nucleusBackendApi'
import { Flex, Image, Tag, Text } from '@chakra-ui/react'

export default function Dashboard() {
  // TODO: This is a placeholder value
  const potentialApy = 6.7

  const networkCount = useAppSelector(selectNetworkCount)
  const formattedTotalTvl = useAppSelector(selectFormattedTotalTvl)

  const { data: tvlData } = useGetTvlQuery()

  return (
    <Flex p={9} direction="column" pb="150px" position="relative">
      {/* Page header */}
      <Flex align="center">
        <Flex direction="column">
          <Text variant="H1">Earn Yield, by Default</Text>
          <Text variant="H1" mt="-8px">
            with Nucleus
          </Text>
          <Flex gap="0.25em">
            <Text variant="body-14" color="element.lighter">
              Mint a Network Asset and explore exciting applications
            </Text>
          </Flex>
          <Flex mt={4} gap={2}>
            <Tag borderRadius="100px" bg="bg.secondary" px="1em" py="0.5em">
              <Flex gap="0.25em">
                <Text variant="body-14" color="element.lighter">
                  {networkCount}
                </Text>
                <Text variant="body-14" color="element.subdued">
                  {networkCount > 1 ? 'Networks' : 'Network'}
                </Text>
              </Flex>
            </Tag>
            <Tag borderRadius="100px" bg="bg.secondary" px="1em" py="0.5em">
              <Flex gap="0.25em">
                <Text variant="body-14" color="element.lighter">
                  {formattedTotalTvl}
                </Text>
                <Text variant="body-14" color="element.subdued">
                  TVL
                </Text>
              </Flex>
            </Tag>
          </Flex>
        </Flex>
        <Flex position="absolute" left="550px" top="-25px" zIndex={-1}>
          <Image width="550px" objectFit="contain" src="/assets/images/nucleus-header.png" alt="Nucleus Header" />
        </Flex>
      </Flex>

      <Flex h="100px" />

      {/* Network asset list */}
      <NetworkAssetList />
    </Flex>
  )
}
