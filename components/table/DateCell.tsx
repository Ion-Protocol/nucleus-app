import { format } from 'date-fns'

interface DateCellProps {
  date: string
  emptyValue?: string
}

export function DateCell({ date, emptyValue = '-' }: DateCellProps) {
  if (!date) return <>{emptyValue}</>
  return <>{format(new Date(date), 'PPpp')}</>
}
