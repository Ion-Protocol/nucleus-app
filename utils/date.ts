import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function formatTimestamps(timestamps: number[]): string[] {
  const dateFormat = 'MMM d'
  return timestamps.map((timestamp) => format(new Date(timestamp), dateFormat, { locale: enUS }))
}
