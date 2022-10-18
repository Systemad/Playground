import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { opentdbSlice } from '../features/quiz/api/CategoryAPI';
import quizOptionSlice from '../features/quiz/utils/quizOptionSlice';
import quizSlice from '../redux/quizSlice';
import { emptySplitApi } from './emptyApi';

export const store = configureStore({
    reducer: {
        [emptySplitApi.reducerPath]: emptySplitApi.reducer,
        [opentdbSlice.reducerPath]: opentdbSlice.reducer,
        quizOptionSlice: quizOptionSlice,
        quizSlice: quizSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(emptySplitApi.middleware)
            .concat(opentdbSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
