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
  },
  extraReducers,
})

export const { setSourceChain, setDestinationChain } = bridgesSlice.actions
export const bridgesReducer = bridgesSlice.reducer
