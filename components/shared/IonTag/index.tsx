import { useAppSelector } from '@/store/hooks'
import { selectHyperlaneChainSelector } from '@/store/slices/networkAssets/selectors'
import { Link, Tag, TagProps, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { OpenNewTabIcon } from '../icons/OpenNewTab'

interface TxHashTagProps extends TagProps, PropsWithChildren {
  txHash: {
    raw: string | null
    formatted: string | null
  }
  baseUrl: string | null
}

export function TxHashTag({ children, txHash, baseUrl, ...props }: TxHashTagProps) {
  const hyperlaneChainSelector = useAppSelector(selectHyperlaneChainSelector)
  const txHashUrl = hyperlaneChainSelector
    ? `${baseUrl}/?search=${txHash.raw}&destination=${hyperlaneChainSelector}`
    : `${baseUrl}/tx/${txHash.raw}`
  return (
    <>
      <Link href={txHashUrl} isExternal>
        <Tag
          borderRadius="100px"
          px={3}
          bg="none"
          cursor="pointer"
          border="1px solid"
          borderColor="textSecondary"
          color="textSecondary"
          {...props}
        >
          <Text>{txHash.formatted}</Text>
          <OpenNewTabIcon fontSize="12px" color="textSecondary" />
        </Tag>
      </Link>
      {hyperlaneChainSelector && (
        <Text textAlign={'center'}>
          It may take up to{' '}
          <Text as="span" fontWeight="bold">
            5 minutes
          </Text>{' '}
          for your transaction to populate on the Hyperlane Explorer
        </Text>
      )}
    </>
  )
}
