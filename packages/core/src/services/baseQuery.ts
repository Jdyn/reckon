import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:4000/api';

export const baseApi = createApi({
	reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl, credentials: 'include' }),
  endpoints: () => ({}),
	tagTypes: ['user', 'sessions', 'session', 'groups', 'group', 'groupBills', 'userBills', 'bill', 'groupMembers']
})
