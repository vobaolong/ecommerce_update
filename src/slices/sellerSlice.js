import { createSlice } from '@reduxjs/toolkit'

const sellerSlice = createSlice({
  name: 'seller',
  initialState: { store: {} },
  reducers: {
    addSeller: (state, action) => {
      state.store = action.payload
    }
  }
})

export const { addSeller } = sellerSlice.actions
export default sellerSlice.reducer
