import { createSlice } from '@reduxjs/toolkit'
import { extraReducers } from './extraReducers'
import { initialState } from './initialState'

const bridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {
    setSourceChain: (state, action) => {
      state.sourceChain = action.payload
    },
    setDestinationChain: (state, action) => {
      state.destinationChain = action.payload
    },
    setInputError: (state, action) => {
      state.inputError = action.payload
    },
    clearInputError: (state) => {
      state.inputError = null
    },
  },
  extraReducers,
})

export const { setSourceChain, setDestinationChain, setInputError, clearInputError } = bridgesSlice.actions
export const bridgesReducer = bridgesSlice.reducer
