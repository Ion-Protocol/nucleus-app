import { createSlice } from '@reduxjs/toolkit'
import { extraReducers } from './extraReducers'
import { initialState } from './initialState'
import { BridgeKey } from '@/config/bridges'

const bridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {
    setSourceChain: (state, action) => {
      state.sourceChain = action.payload
    },
    clearSourceChain: (state) => {
      state.sourceChain = null
    },
    setDestinationChain: (state, action) => {
      state.destinationChain = action.payload
    },
    clearDestinationChain: (state) => {
      state.destinationChain = null
    },
  },
  extraReducers,
})

export const { setSourceChain, clearSourceChain, setDestinationChain, clearDestinationChain } = bridgesSlice.actions
export const bridgesReducer = bridgesSlice.reducer
