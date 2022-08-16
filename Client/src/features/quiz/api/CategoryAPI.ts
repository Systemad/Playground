import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const opentdbSlice = createApi({
  reducerPath: 'opentdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://opentdb.com/',
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<QuizGetCategoriesResponse, QuizGetCategoriesApiArg>({
      query: () => ({ url: `api_category.php` })
    }),
  }),
});
export const { useGetCategoriesQuery } = opentdbSlice;
export type QuizGetCategoriesResponse = Categories;
export type QuizGetCategoriesApiArg = void;
export type Categories = {
  trivia_categories: TriviaCategory[];
}
export type TriviaCategory = {
  id: string;
  name: string;
};
