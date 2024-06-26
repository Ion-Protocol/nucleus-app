import { Tag, TagProps, Text, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren, useState } from 'react'
import { ClipIcon } from '../icons/ClipIcon'

interface TxHashTagProps extends TagProps, PropsWithChildren {
  txHash: {
    raw: string | null
    formatted: string | null
  }
}

export function TxHashTag({ children, txHash, ...props }: TxHashTagProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCopy = () => {
    if (!txHash.raw) return
    navigator.clipboard
      .writeText(txHash.raw)
      .then(() => {
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 3000)
      })
      .catch((error) => {
        console.error('Failed to copy:', error)
      })
  }

  return (
    <Tooltip label="Copied!" isOpen={showTooltip} placement="right" shouldWrapChildren>
      <Tag borderRadius="100px" px={3} bg="clip.background" cursor="pointer" onClick={handleCopy} {...props}>
        <ClipIcon />
        <Text>{txHash.formatted}</Text>
      </Tag>
    </Tooltip>
  )
}
