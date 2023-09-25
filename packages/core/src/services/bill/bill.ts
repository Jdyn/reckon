import { baseApi } from '../baseQuery';
import { Bill } from './types';

const groupApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		groupBills: query<{ bills: Bill[]}, string>({ query: (id) => `/groups/${id}/bills`, providesTags: ['groupBills'] }),
	})
});

export const {
	useGroupBillsQuery
} = groupApi;

export default groupApi;
