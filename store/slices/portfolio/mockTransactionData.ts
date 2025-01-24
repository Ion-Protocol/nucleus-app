import { TransactionDataItem } from './selectors'

export const mockTransactionData: TransactionDataItem[] = [
  {
    id: 1,
    status: 'pending',
    type: 'withdraw',
    activity: {
      source: {
        token: 'sseth',
        chain: 'sei',
      },
      destination: {
        token: 'weth',
        chain: 'ethereum',
      },
    },
    sourceAmount: '10000000000000000000',
    destinationAmount: '10000000000000000000',
    date: 1715659690000, // 12 May 2024 06:08:10
    minimumPrice: 0.05,
    receiveAtLeast: 0.045,
    deadline: 1715728800000, // 12 May 2024 10:00 PM EST
    createdAt: 1715541060000, // 9 May 2024 01:11 PM EST
    filledPrice: 0.055,
    filledAt: 1715624640000, // 11 May 2024 10:24 AM EST
  },
  {
    id: 2,
    status: 'fulfilled',
    type: 'withdraw',
    activity: {
      source: {
        token: 'earneth',
        chain: 'ethereum',
      },
      destination: {
        token: 'weth',
        chain: 'ethereum',
      },
    },
    sourceAmount: '10000000000000000000',
    destinationAmount: '10000000000000000000',
    date: 1715918890000, // 15 May 2024 06:08:10
    minimumPrice: 0.05,
    receiveAtLeast: 0.045,
    deadline: 1715988000000, // 15 May 2024 10:00 PM EST
    createdAt: 1715800260000, // 12 May 2024 01:11 PM EST
    filledPrice: 0.055,
    filledAt: 1715883840000, // 14 May 2024 10:24 AM EST
  },
  {
    id: 3,
    status: 'fulfilled',
    type: 'deposit',
    activity: {
      source: {
        token: 'eth',
        chain: 'ethereum',
      },
      destination: {
        token: 'sseth',
        chain: 'sei',
      },
    },
    sourceAmount: '10000000000000000000',
    destinationAmount: '10000000000000000000',
    date: 1716178090000, // 18 May 2024 06:08:10
    minimumPrice: 0.05,
    receiveAtLeast: 0.045,
    deadline: 1716247200000, // 18 May 2024 10:00 PM EST
    createdAt: 1716059460000, // 15 May 2024 01:11 PM EST
    filledPrice: 0.055,
    filledAt: 1716153040000, // 17 May 2024 10:24 AM EST
  },
  {
    id: 4,
    status: 'fulfilled',
    type: 'deposit',
    activity: {
      source: {
        token: 'weeth',
        chain: 'ethereum',
      },
      destination: {
        token: 'earneth',
        chain: 'ethereum',
      },
    },
    sourceAmount: '10000000000000000000',
    destinationAmount: '10000000000000000000',
    date: 1716437290000, // 21 May 2024 06:08:10
    minimumPrice: 0.05,
    receiveAtLeast: 0.045,
    deadline: 1716506400000, // 21 May 2024 10:00 PM EST
    createdAt: 1716318660000, // 18 May 2024 01:11 PM EST
    filledPrice: 0.055,
    filledAt: 1716412240000, // 20 May 2024 10:24 AM EST
  },
]
