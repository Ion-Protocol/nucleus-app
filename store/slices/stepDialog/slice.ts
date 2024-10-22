// store/dialogSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type StepState = 'idle' | 'active' | 'completed' | 'error'

export type DialogStep = {
  id: string
  description: string
  state: StepState
  errorMessage?: string
}

type DialogState = {
  steps: DialogStep[]
  title: string
  open: boolean
  extraContent: React.ReactNode | null
}

const initialState: DialogState = {
  steps: [],
  title: 'Transaction in progress...',
  open: false,
  extraContent: null,
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<DialogStep[]>) => {
      state.steps = action.payload
    },
    setDialogStep: (
      state,
      action: PayloadAction<{
        stepId: string
        newState?: StepState
        errorMessage?: string
      }>
    ) => {
      const { stepId, newState, errorMessage } = action.payload
      const stepIndex = state.steps.findIndex((step) => step.id === stepId)
      if (stepIndex !== -1) {
        state.steps[stepIndex] = {
          ...state.steps[stepIndex],
          state: newState || (errorMessage ? 'error' : 'active'),
          errorMessage: errorMessage || '',
        }
        for (let i = 0; i < stepIndex; i++) {
          state.steps[i].state = 'completed'
        }
        for (let i = stepIndex + 1; i < state.steps.length; i++) {
          state.steps[i].state = 'idle'
        }
      }
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setExtraContent: (state, action: PayloadAction<React.ReactNode>) => {
      state.extraContent = action.payload
    },
  },
})

export const { setSteps, setDialogStep, setOpen, setTitle, setExtraContent } = dialogSlice.actions

export const dialogReducer = dialogSlice.reducer
