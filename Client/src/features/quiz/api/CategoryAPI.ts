import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { emptySplitApi as api } from '../../../providers/emptyApi';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://opentdb.com',
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<QuizGetCategoriesResponse, QuizGetCategoriesApiArg>({
      query: () => `/api_category.php`,
      transformResponse: (response: {categories: {data: TriviaCategory[]}}) =>
        response.categories.data,
    }),
  }),
})
export type QuizGetCategoriesResponse = /** status 200  */ TriviaCategory[];
export type QuizGetCategoriesApiArg = void

export const { useGetCategoriesQuery } = apiSlice;


export interface Categories {
  triviaCategories: TriviaCategory[];
}

export interface TriviaCategory {
  id:   number;
  name: string;
}
