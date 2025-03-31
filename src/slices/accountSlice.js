import { createSlice } from '@reduxjs/toolkit'

const accountSlice = createSlice({
  name: 'account',
  initialState: { user: {} },
  reducers: {
    addAccount: {
      reducer: (state, action) => {
        state.user = action.payload
      },
      prepare: (user) => {
        if (!user || typeof user !== 'object') {
          throw new Error('Invalid user data')
        }
        return { payload: user }
      }
    },
    updateAvatar: (state, action) => {
      state.user.avatar = action.payload
    }
  }
})

export const { addAccount, updateAvatar } = accountSlice.actions
export default accountSlice.reducer
