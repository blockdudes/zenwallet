import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

interface PageSelectorState {
  value: string
}

const initialState: PageSelectorState = {
  value: 'wallet',
}

export const pageSelectorSlice = createSlice({
  name: 'pageSelector',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { setPage } = pageSelectorSlice.actions

export const selectPage = (state: RootState) => state.pageSelector.value

// Other code such as selectors can use the imported `RootState` type

export default pageSelectorSlice.reducer

// usage


// import { useAppSelector, useAppDispatch } from 'app/hooks'

// import { decrement, increment } from './counterSlice'

// export function Counter() {
//   // The `state` arg is correctly typed as `RootState` already
//   const count = useAppSelector((state) => state.counter.value)
//   const dispatch = useAppDispatch()
//   dispatch(increment())
//   // omit rendering logic
// }