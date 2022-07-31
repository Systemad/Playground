import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { acquireAccessToken, msalInstance } from '../utils/auth/MsalKey';

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery:
    fetchBaseQuery(
      {
        baseUrl: 'https://localhost:7069',
        prepareHeaders: async (headers) => {
          const token = await acquireAccessToken(msalInstance);
          // If we have a token set in state, let's assume that we should be passing it.
          if (token) {
            headers.set('authorization', `Bearer ${token}`)
          }
          return headers
        },
      }),
  endpoints: () => ({}),
  refetchOnMountOrArgChange: false
})