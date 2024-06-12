import { createSlice } from '@reduxjs/toolkit'
import { extraReducers } from './extraReducers'
import { initialState } from './initialState'

const BridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {},
  extraReducers,
})

// Export reducer
export const bridgesReducer = BridgesSlice.reducer
