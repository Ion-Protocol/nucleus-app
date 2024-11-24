import {
  RedeemStepType,
  restoreCompletedSteps,
  setDialogStep,
  setHeaderContent,
  setOpen,
  setStatus,
  setSteps,
  setTitle,
} from '@/store/slices/stepDialog/slice'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const useRedeemDialog = (isBridgeRequired: boolean) => {
  const dispatch = useDispatch()

  const createSteps = useCallback(() => {
    if (isBridgeRequired) {
      return [
        { id: 1, type: RedeemStepType.BRIDGE, description: 'Request Bridge', state: 'idle' },
        { id: 2, type: RedeemStepType.APPROVE, description: 'Approve', state: 'idle' },
        { id: 3, type: RedeemStepType.REQUEST, description: 'Request Withdraw', state: 'idle' },
      ]
    }
    return [
      { id: 1, type: RedeemStepType.APPROVE, description: 'Approve', state: 'idle' },
      { id: 2, type: RedeemStepType.REQUEST, description: 'Request Withdraw', state: 'idle' },
    ]
  }, [isBridgeRequired])

  const initializeDialog = useCallback(() => {
    dispatch(setTitle('Redeem Status'))
    dispatch(setSteps(createSteps()))
    dispatch(setHeaderContent('redeemSummary'))
    dispatch(setOpen(true))
    dispatch(restoreCompletedSteps())
  }, [dispatch, createSteps])

  const updateStep = useCallback(
    (stepType: RedeemStepType, state: 'active' | 'completed' | 'error', link?: string) => {
      const steps = createSteps()
      const step = steps.find((s) => s.type === stepType)
      if (step) {
        dispatch(
          setDialogStep({
            stepId: step.id,
            newState: state,
            link,
          })
        )
      }
    },
    [dispatch, createSteps]
  )

  const setError = useCallback(
    (message: string, fullMessage?: string) => {
      dispatch(
        setStatus({
          type: 'error',
          message,
          fullMessage,
        })
      )
    },
    [dispatch]
  )

  const setSuccess = useCallback(() => {
    dispatch(setStatus({ type: 'success' }))
    dispatch(setHeaderContent('redeemSummary'))
  }, [dispatch])

  return {
    initializeDialog,
    updateStep,
    setError,
    setSuccess,
  }
}
