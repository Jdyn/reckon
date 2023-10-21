import { baseApi } from '../baseQuery';
import { Bill } from './types';

const billsApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		groupBills: query<Bill[], string>({ query: (id) => `/groups/${id}/bills`, providesTags: ['groupBills'] }),
		userBills: query<Bill[], void>({ query: () => `/account/bills`, providesTags: ['userBills'] }),
		globalBills: query<Bill[], void>({ query: () => `/bills`, providesTags: ['userBills'] }),
	})
});

export const {
	useGroupBillsQuery,
	useUserBillsQuery,
	useGlobalBillsQuery
} = billsApi;

export default billsApi;
