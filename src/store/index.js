import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import userReducer from './user'

const store = configureStore({
  reducer: {
    user: userReducer
  }
})

// 导出类型安全的hooks
export const useAppDispatch = useDispatch
export const useAppSelector = useSelector

export default store
