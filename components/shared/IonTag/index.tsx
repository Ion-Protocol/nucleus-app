import { Tag, TagProps, Text, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren, useState } from 'react'
import { ClipIcon } from '../icons/ClipIcon'

interface IonTagProps extends TagProps, PropsWithChildren {
  txHash: string
}

export function IonTag({ children, txHash, ...props }: IonTagProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCopy = () => {
    if (!txHash) return
    navigator.clipboard
      .writeText(txHash)
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
        <Text>{txHash}</Text>
      </Tag>
    </Tooltip>
  )
}
