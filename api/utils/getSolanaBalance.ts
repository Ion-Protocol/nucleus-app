import { eclipseRpcUrl } from '@/config/constants'
import { convertToDecimals } from '@/utils/number'
import { Connection, PublicKey } from '@solana/web3.js'

/**
 * Fetches the token balance for a specific token mint and user address on Solana.
 *
 * In Solana, tokens are stored in multiple token accounts rather than directly
 * at the wallet address. These token accounts are sub-accounts of the user's
 * main wallet address and can hold fractions of the total balance. Therefore,
 * accumulation is necessary to get the full token balance.
 *
 * @param userAddress - The Solana address of the user (copied from Phantom).
 * @param tokenMint - The mint address of the specific token (e.g., tETH).
 * @returns The total token balance for the specified token mint.
 */
export async function getSolanaBalance(userAddress: string, tokenMint: string): Promise<bigint> {
  const connection = new Connection(eclipseRpcUrl, 'confirmed')

  // Create PublicKey objects for the wallet and token mint
  const wallet = new PublicKey(userAddress)
  const tokenMintAsPublicKey = new PublicKey(tokenMint)

  // Fetch all token accounts for the given wallet and token mint
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
    mint: tokenMintAsPublicKey,
  })

  // Initialize balance
  let balance = 0

  // Accumulate balance across all token accounts for this mint
  // (Solana can split token balances across multiple accounts under the same wallet)
  tokenAccounts.value.forEach((accountInfo) => {
    const tokenAmount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount
    balance += tokenAmount // Add balance from each token account
  })

  return BigInt(convertToDecimals(balance.toString(), 18))
}
