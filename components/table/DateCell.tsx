import { Flex } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'

interface DateCellProps {
  date: string
  emptyValue?: string
}

export function DateCell({ date, emptyValue = '-' }: DateCellProps) {
  if (!date || date === '0') return <>{emptyValue}</>
  return <Flex>{format(fromUnixTime(Number(date)), 'PP')}</Flex>
}
