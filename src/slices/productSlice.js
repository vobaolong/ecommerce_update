import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
  name: 'product',
  initialState: { product: {} },
  reducers: {
    addProduct: (state, action) => {
      state.product = action.payload
    }
  }
})

export const { addProduct } = productSlice.actions
export default productSlice.reducer
