import { ResponsiveContainer, Treemap } from 'recharts'
import { AllocationBox } from './AllocationBox'

const data = [
  {
    name: 'alpha',
    size: 50,
  },
  {
    name: 'beta',
    size: 40,
  },
  {
    name: 'gamma',
    size: 30,
  },
]

export function LoadingChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
      <Treemap data={data} dataKey="size" content={<AllocationBox isLoading={true} />} animationDuration={0}></Treemap>
    </ResponsiveContainer>
  )
}
