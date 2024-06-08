import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// ==================
// 1. STATE INTERFACE
// ==================
interface CounterState {
  value: number
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: CounterState = {
  value: 0,
}

// ==================
// 3. REDUCERS
// ==================
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

// ==================
// 4. HELPFUL EXPORTS
// ==================
export const { increment, decrement, incrementByAmount, setCount } = counterSlice.actions
export const selectCount = (state: RootState) => state.counter.value

export const counterReducer = counterSlice.reducer
