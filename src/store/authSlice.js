import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'dark',
  token: null,
  user: null,
  posts: [],
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setLogOut: (state) => {
      state.token = null
      state.user = null
    },

    setTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setPosts: (state, action) => {
      state.posts = action.payload
    },
    updatePosts: (state, action) => {
      state.posts = state.posts.map((item) => {
        return item._id === action.payload._id ? { ...item, ...action.payload } : item
      })
    },
  },
})

export const { setToken, setUser, setLogOut, setMsg, setTheme, setPosts, updatePosts } = authSlice.actions

export default authSlice.reducer
