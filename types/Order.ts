export interface Order {
  id: number
  user: string
  offer_token: string
  want_token: string
  amount: string
  deadline: string
  atomic_price: string
  created_timestamp: string
  ending_timestamp: string
  created_log_index: number
  created_transaction_index: number
  created_block_number: string
  ending_log_index: number
  ending_transaction_index: number
  ending_block_number: string
  status: 'pending' | 'completed' | 'cancelled'
  queue_address: string
  chain_id: number
  offer_amount_spent: string
  want_amount_rec: string
  created_transaction_hash: string
  ending_transaction_hash: string
}

export interface PaginatedResponse {
  data: Order[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
