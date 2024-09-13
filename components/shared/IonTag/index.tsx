import { etherscanBaseUrl, layerZeroBaseUrl } from '@/config/constants'
import { Link, Tag, TagProps, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { ClipIcon } from '../icons/ClipIcon'
import { OpenNewTabIcon } from '../icons/OpenNewTab'

interface TxHashTagProps extends TagProps, PropsWithChildren {
  txHash: {
    raw: string | null
    formatted: string | null
  }
  shouldShowLayerZeroLink?: boolean
}

export function TxHashTag({ children, txHash, shouldShowLayerZeroLink = true, ...props }: TxHashTagProps) {
  return (
    <Link href={`${shouldShowLayerZeroLink ? layerZeroBaseUrl : etherscanBaseUrl}${txHash.raw}`} isExternal>
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
  )
}
