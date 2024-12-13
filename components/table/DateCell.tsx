import { format, fromUnixTime } from 'date-fns'

interface DateCellProps {
  date: string
  emptyValue?: string
}

export function DateCell({ date, emptyValue = '-' }: DateCellProps) {
  if (!date) return <>{emptyValue}</>
  return <>{format(fromUnixTime(Number(date)), 'PP')}</>
}
