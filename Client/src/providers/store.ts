import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux';

import { opentdbSlice } from '../features/quiz/api/CategoryAPI';
import { emptySplitApi } from './emptyApi';

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    [opentdbSlice.reducerPath]: opentdbSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware).concat(opentdbSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export default store;