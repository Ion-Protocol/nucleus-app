import { Code, Grid, GridItem, IconButton } from '@chakra-ui/react'
import { Copy } from 'lucide-react'

const ErrorCodeBlock = ({ error }: { error: string }) => {
  const obj = JSON.parse(error)
  const formattedError = JSON.stringify(obj, null, 2)
  return (
    <Grid w="100%" maxH="25rem" overflowY="auto" borderRadius="2xl" bg="code.background">
      <Code gridColumn="1" gridRow="1" p={4} whiteSpace="pre-wrap" wordBreak="break-word">
        {formattedError}
      </Code>
      <GridItem gridColumn="1" gridRow="1" placeItems="start end">
        <IconButton
          mr={4}
          mt={2}
          variant="ghost"
          gridColumn="1"
          gridRow="1"
          aria-label="Copy"
          icon={<Copy />}
          onClick={() => {
            navigator.clipboard.writeText(error)
          }}
        />
      </GridItem>
    </Grid>
  )
}

export default ErrorCodeBlock
