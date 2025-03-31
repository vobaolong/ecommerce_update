import { createSlice } from '@reduxjs/toolkit'

const storeSlice = createSlice({
  name: 'store',
  initialState: { store: {} },
  reducers: {
    addStore: (state, action) => {
      state.store = action.payload
    },
    updateIsFollowing: (state, action) => {
      state.store.isFollowing = action.payload
    },
    updateLevel: (state, action) => {
      state.store.level = action.payload
    }
  }
})

export const { addStore, updateIsFollowing, updateLevel } = storeSlice.actions
export default storeSlice.reducer
