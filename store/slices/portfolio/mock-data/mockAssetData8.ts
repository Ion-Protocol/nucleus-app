export const mockAssetData = [
  {
    // Duplicate token "WETH" across different networks
    asset: 'WETH',
    network: 'Ethereum',
    earningsApy: 3.7,
    amount: 1.0,
    usdValue: 1300,
    rewardCount: 2,
  },
  {
    // Same token "WETH" but different network "Sei"
    asset: 'WETH',
    network: 'Sei',
    earningsApy: 4.2,
    amount: 2.0,
    usdValue: 2000,
    rewardCount: 4,
  },
  {
    // Duplicate token "SSETH" across different networks
    asset: 'ssETH',
    network: 'Ethereum',
    earningsApy: 3.9,
    amount: 1.4,
    usdValue: 3000,
    rewardCount: 5,
  },
  {
    // Same token "SSETH" but different network "Sei"
    asset: 'ssETH',
    network: 'Sei',
    earningsApy: 2.8,
    amount: 0.9,
    usdValue: 700,
    rewardCount: 1,
  },
  {
    // Unique token + network combo
    asset: 'rariETH',
    network: 'Rari',
    earningsApy: 4.5,
    amount: 0.6,
    usdValue: 10000,
    rewardCount: 8,
  },
]
