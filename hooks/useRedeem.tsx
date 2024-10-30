import { useDispatch, useSelector } from 'react-redux'
import { setOpen, setSteps, setTitle, setExtraContent, setDialogStep } from '@/store/slices/stepDialog/slice'

import RedeemSummaryCard, {
  type RedeemSummaryCardProps,
} from '@/components/NetworkAsset/MintAndRedeem/Redeem/RedeemSummaryCard'

export function useRedeem() {
  const dispatch = useDispatch()

  const handleRedeem = (summaryData: RedeemSummaryCardProps) => {
    // Set the dialog title
    dispatch(setTitle('Order Status'))

    // Set the steps for the redeem process
    dispatch(
      setSteps([
        { id: '1', description: 'Approve', state: 'idle' },
        { id: '2', description: 'Request Withdraw', state: 'idle' },
        { id: '3', description: 'Receive ETH', state: 'idle' },
      ])
    )

    // Set the extra content with the summary card
    dispatch(setExtraContent(<RedeemSummaryCard {...summaryData} />))

    // Open the dialog
    dispatch(setOpen(true))
  }

  return { handleRedeem }
}
