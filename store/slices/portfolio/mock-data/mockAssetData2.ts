export const mockAssetData = [
  {
    // Duplicate token "DINERO" across different networks
    asset: 'DINERO',
    network: 'Dinero',
    earningsApy: 2.5,
    amount: 1.5,
    usdValue: 1800,
    rewardCount: 3,
  },
  {
    // Same token "DINERO" but different network "Sei"
    asset: 'DINERO',
    network: 'Sei',
    earningsApy: 3.2,
    amount: 2.4,
    usdValue: 2500,
    rewardCount: 2,
  },
  {
    // Duplicate token "TETH" across different networks
    asset: 'TETH',
    network: 'Ethereum',
    earningsApy: 4.1,
    amount: 1.0,
    usdValue: 1600,
    rewardCount: 6,
  },
  {
    // Same token "TETH" but different network "Eclipse"
    asset: 'TETH',
    network: 'Eclipse',
    earningsApy: 2.2,
    amount: 0.8,
    usdValue: 900,
    rewardCount: 1,
  },
  {
    // Duplicate network "Ethereum" with a different token "RSWETH"
    asset: 'RSWETH',
    network: 'Ethereum',
    earningsApy: 3.6,
    amount: 1.1,
    usdValue: 1900,
    rewardCount: 4,
  },
]
