export const AtomicQueueAbi = [
  {
    type: 'function',
    name: 'getUserAtomicRequest',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'offer', type: 'address', internalType: 'contract ERC20' },
      { name: 'want', type: 'address', internalType: 'contract ERC20' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct AtomicQueue.AtomicRequest',
        components: [
          { name: 'deadline', type: 'uint64', internalType: 'uint64' },
          { name: 'atomicPrice', type: 'uint88', internalType: 'uint88' },
          { name: 'offerAmount', type: 'uint96', internalType: 'uint96' },
          { name: 'inSolve', type: 'bool', internalType: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isAtomicRequestValid',
    inputs: [
      { name: 'offer', type: 'address', internalType: 'contract ERC20' },
      { name: 'user', type: 'address', internalType: 'address' },
      {
        name: 'userRequest',
        type: 'tuple',
        internalType: 'struct AtomicQueue.AtomicRequest',
        components: [
          { name: 'deadline', type: 'uint64', internalType: 'uint64' },
          { name: 'atomicPrice', type: 'uint88', internalType: 'uint88' },
          { name: 'offerAmount', type: 'uint96', internalType: 'uint96' },
          { name: 'inSolve', type: 'bool', internalType: 'bool' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'solve',
    inputs: [
      { name: 'offer', type: 'address', internalType: 'contract ERC20' },
      { name: 'want', type: 'address', internalType: 'contract ERC20' },
      { name: 'users', type: 'address[]', internalType: 'address[]' },
      { name: 'runData', type: 'bytes', internalType: 'bytes' },
      { name: 'solver', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateAtomicRequest',
    inputs: [
      { name: 'offer', type: 'address', internalType: 'contract ERC20' },
      { name: 'want', type: 'address', internalType: 'contract ERC20' },
      {
        name: 'userRequest',
        type: 'tuple',
        internalType: 'struct AtomicQueue.AtomicRequest',
        components: [
          { name: 'deadline', type: 'uint64', internalType: 'uint64' },
          { name: 'atomicPrice', type: 'uint88', internalType: 'uint88' },
          { name: 'offerAmount', type: 'uint96', internalType: 'uint96' },
          { name: 'inSolve', type: 'bool', internalType: 'bool' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'userAtomicRequest',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'contract ERC20' },
      { name: '', type: 'address', internalType: 'contract ERC20' },
    ],
    outputs: [
      { name: 'deadline', type: 'uint64', internalType: 'uint64' },
      { name: 'atomicPrice', type: 'uint88', internalType: 'uint88' },
      { name: 'offerAmount', type: 'uint96', internalType: 'uint96' },
      { name: 'inSolve', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'viewSolveMetaData',
    inputs: [
      { name: 'offer', type: 'address', internalType: 'contract ERC20' },
      { name: 'want', type: 'address', internalType: 'contract ERC20' },
      { name: 'users', type: 'address[]', internalType: 'address[]' },
    ],
    outputs: [
      {
        name: 'metaData',
        type: 'tuple[]',
        internalType: 'struct AtomicQueue.SolveMetaData[]',
        components: [
          { name: 'user', type: 'address', internalType: 'address' },
          { name: 'flags', type: 'uint8', internalType: 'uint8' },
          { name: 'assetsToOffer', type: 'uint256', internalType: 'uint256' },
          { name: 'assetsForWant', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: 'totalAssetsForWant', type: 'uint256', internalType: 'uint256' },
      { name: 'totalAssetsToOffer', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AtomicRequestFulfilled',
    inputs: [
      { name: 'user', type: 'address', indexed: false, internalType: 'address' },
      { name: 'offerToken', type: 'address', indexed: false, internalType: 'address' },
      { name: 'wantToken', type: 'address', indexed: false, internalType: 'address' },
      { name: 'offerAmountSpent', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'wantAmountReceived', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AtomicRequestUpdated',
    inputs: [
      { name: 'user', type: 'address', indexed: false, internalType: 'address' },
      { name: 'offerToken', type: 'address', indexed: false, internalType: 'address' },
      { name: 'wantToken', type: 'address', indexed: false, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'deadline', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'minPrice', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AtomicQueue__RequestDeadlineExceeded',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AtomicQueue__UserNotInSolve',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AtomicQueue__UserRepeated',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AtomicQueue__ZeroOfferAmount',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
  },
] as const
