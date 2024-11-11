// store/dialogSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum RedeemStepType {
  BRIDGE = 'BRIDGE',
  APPROVE = 'APPROVE',
  REQUEST = 'REQUEST',
  CONFIRM = 'CONFIRM',
}

export type StepState = 'idle' | 'active' | 'completed' | 'error'

export type DialogStep = {
  id: number
  type: RedeemStepType
  description: string
  state: StepState
  errorMessage?: string
  link?: string
}

type DialogStatus =
  | { type: 'success'; message?: string; fullMessage?: string; link?: string }
  | { type: 'error'; message?: string; fullMessage?: string; link?: string }
  | undefined

type DialogState = {
  steps: DialogStep[]
  title: string
  open: boolean
  headerContent?: 'redeemSummary' | 'mintSummary' | string
  status: DialogStatus
}

const initialState: DialogState = {
  steps: [],
  title: 'Transaction in progress...',
  open: false,
  headerContent: undefined,
  status: undefined,
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setSteps: (state: DialogState, action: PayloadAction<DialogStep[]>) => {
      state.steps = action.payload
    },
    setDialogStep: (
      state: DialogState,
      action: PayloadAction<{
        stepId: number
        newState?: StepState
        errorMessage?: string
        link?: string
      }>
    ) => {
      const { stepId, newState, errorMessage, link } = action.payload
      const stepIndex = state.steps.findIndex((step) => step.id === stepId)
      if (stepIndex !== -1) {
        state.steps[stepIndex] = {
          ...state.steps[stepIndex],
          state: newState || (errorMessage ? 'error' : 'active'),
          errorMessage: errorMessage || '',
          link: link || '',
        }
        for (let i = 0; i < stepIndex; i++) {
          state.steps[i].state = 'completed'
        }
        for (let i = stepIndex + 1; i < state.steps.length; i++) {
          state.steps[i].state = 'idle'
        }
      }
    },
    setOpen: (state: DialogState, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
    setTitle: (state: DialogState, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setStatus: (state: DialogState, action: PayloadAction<DialogStatus>) => {
      state.status = action.payload
    },
    setHeaderContent: (
      state: DialogState,
      action: PayloadAction<'redeemSummary' | 'redeemSuccess' | 'mintSummary' | 'mintSuccess' | 'Error' | string>
    ) => {
      state.headerContent = action.payload
    },
  },
})

export const { setSteps, setDialogStep, setOpen, setTitle, setHeaderContent } = dialogSlice.actions

export const dialogReducer = dialogSlice.reducer
