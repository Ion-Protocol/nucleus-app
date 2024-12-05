export const AccountantWithRateProvidersAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_owner', type: 'address', internalType: 'address' },
      { name: '_vault', type: 'address', internalType: 'address' },
      { name: 'payoutAddress', type: 'address', internalType: 'address' },
      { name: 'startingExchangeRate', type: 'uint96', internalType: 'uint96' },
      { name: '_base', type: 'address', internalType: 'address' },
      { name: 'allowedExchangeRateChangeUpper', type: 'uint16', internalType: 'uint16' },
      { name: 'allowedExchangeRateChangeLower', type: 'uint16', internalType: 'uint16' },
      { name: 'minimumUpdateDelayInSeconds', type: 'uint32', internalType: 'uint32' },
      { name: 'managementFee', type: 'uint16', internalType: 'uint16' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'accountantState',
    inputs: [],
    outputs: [
      { name: 'payoutAddress', type: 'address', internalType: 'address' },
      { name: 'feesOwedInBase', type: 'uint128', internalType: 'uint128' },
      { name: 'totalSharesLastUpdate', type: 'uint128', internalType: 'uint128' },
      { name: 'exchangeRate', type: 'uint96', internalType: 'uint96' },
      { name: 'allowedExchangeRateChangeUpper', type: 'uint16', internalType: 'uint16' },
      { name: 'allowedExchangeRateChangeLower', type: 'uint16', internalType: 'uint16' },
      { name: 'lastUpdateTimestamp', type: 'uint64', internalType: 'uint64' },
      { name: 'isPaused', type: 'bool', internalType: 'bool' },
      { name: 'minimumUpdateDelayInSeconds', type: 'uint32', internalType: 'uint32' },
      { name: 'managementFee', type: 'uint16', internalType: 'uint16' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'authority',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract Authority' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'base',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract ERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'claimFees',
    inputs: [{ name: 'feeAsset', type: 'address', internalType: 'contract ERC20' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRate',
    inputs: [],
    outputs: [{ name: 'rate', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRateInQuote',
    inputs: [{ name: 'quote', type: 'address', internalType: 'contract ERC20' }],
    outputs: [{ name: 'rateInQuote', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRateInQuoteSafe',
    inputs: [{ name: 'quote', type: 'address', internalType: 'contract ERC20' }],
    outputs: [{ name: 'rateInQuote', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRateSafe',
    inputs: [],
    outputs: [{ name: 'rate', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', name: 'pause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'rateProviderData',
    inputs: [{ name: '', type: 'address', internalType: 'contract ERC20' }],
    outputs: [
      { name: 'isPeggedToBase', type: 'bool', internalType: 'bool' },
      { name: 'rateProvider', type: 'address', internalType: 'contract IRateProvider' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setAuthority',
    inputs: [{ name: 'newAuthority', type: 'address', internalType: 'contract Authority' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setRateProviderData',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'contract ERC20' },
      { name: 'isPeggedToBase', type: 'bool', internalType: 'bool' },
      { name: 'rateProvider', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'function', name: 'unpause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'updateDelay',
    inputs: [{ name: 'minimumUpdateDelayInSeconds', type: 'uint32', internalType: 'uint32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateExchangeRate',
    inputs: [{ name: 'newExchangeRate', type: 'uint96', internalType: 'uint96' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateLower',
    inputs: [{ name: 'allowedExchangeRateChangeLower', type: 'uint16', internalType: 'uint16' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateManagementFee',
    inputs: [{ name: 'managementFee', type: 'uint16', internalType: 'uint16' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updatePayoutAddress',
    inputs: [{ name: 'payoutAddress', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateUpper',
    inputs: [{ name: 'allowedExchangeRateChangeUpper', type: 'uint16', internalType: 'uint16' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'vault',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract BoringVault' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AuthorityUpdated',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'newAuthority', type: 'address', indexed: true, internalType: 'contract Authority' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DelayInSecondsUpdated',
    inputs: [
      { name: 'oldDelay', type: 'uint32', indexed: false, internalType: 'uint32' },
      { name: 'newDelay', type: 'uint32', indexed: false, internalType: 'uint32' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ExchangeRateUpdated',
    inputs: [
      { name: 'oldRate', type: 'uint96', indexed: false, internalType: 'uint96' },
      { name: 'newRate', type: 'uint96', indexed: false, internalType: 'uint96' },
      { name: 'currentTime', type: 'uint64', indexed: false, internalType: 'uint64' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FeesClaimed',
    inputs: [
      { name: 'feeAsset', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LowerBoundUpdated',
    inputs: [
      { name: 'oldBound', type: 'uint16', indexed: false, internalType: 'uint16' },
      { name: 'newBound', type: 'uint16', indexed: false, internalType: 'uint16' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagementFeeUpdated',
    inputs: [
      { name: 'oldFee', type: 'uint16', indexed: false, internalType: 'uint16' },
      { name: 'newFee', type: 'uint16', indexed: false, internalType: 'uint16' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'newOwner', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
  { type: 'event', name: 'Paused', inputs: [], anonymous: false },
  {
    type: 'event',
    name: 'PayoutAddressUpdated',
    inputs: [
      { name: 'oldPayout', type: 'address', indexed: false, internalType: 'address' },
      { name: 'newPayout', type: 'address', indexed: false, internalType: 'address' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RateProviderUpdated',
    inputs: [
      { name: 'asset', type: 'address', indexed: false, internalType: 'address' },
      { name: 'isPegged', type: 'bool', indexed: false, internalType: 'bool' },
      { name: 'rateProvider', type: 'address', indexed: false, internalType: 'address' },
    ],
    anonymous: false,
  },
  { type: 'event', name: 'Unpaused', inputs: [], anonymous: false },
  {
    type: 'event',
    name: 'UpperBoundUpdated',
    inputs: [
      { name: 'oldBound', type: 'uint16', indexed: false, internalType: 'uint16' },
      { name: 'newBound', type: 'uint16', indexed: false, internalType: 'uint16' },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'AccountantWithRateProviders__LowerBoundTooLarge', inputs: [] },
  { type: 'error', name: 'AccountantWithRateProviders__ManagementFeeTooLarge', inputs: [] },
  { type: 'error', name: 'AccountantWithRateProviders__OnlyCallableByBoringVault', inputs: [] },
  { type: 'error', name: 'AccountantWithRateProviders__Paused', inputs: [] },
  { type: 'error', name: 'AccountantWithRateProviders__UpdateDelayTooLarge', inputs: [] },
  { type: 'error', name: 'AccountantWithRateProviders__UpperBoundTooSmall', inputs: [] },
  { type: 'error', name: 'AccountantWithRateProviders__ZeroFeesOwed', inputs: [] },
] as const
