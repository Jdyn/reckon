import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from '../baseQuery';
import { Bill } from './types';

const groupApi = createApi({
	reducerPath: 'bill',
	baseQuery,
	tagTypes: ['groupBills', 'userBills', 'bill'],
	endpoints: ({ query, mutation }) => ({
		groupBills: query<{ bills: Bill[]}, string>({ query: (id) => `/groups/${id}/bills`, providesTags: ['groupBills'] }),
	})
});

export const {
	useGroupBillsQuery
} = groupApi;

export default groupApi;
