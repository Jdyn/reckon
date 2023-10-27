import { baseApi } from '../baseQuery';
import { Bill } from './types';

export type BillListType = 'group' | 'user' | 'global';

type BillListEndpoints = {
	[key in BillListType]: (id: string | undefined) => string;
};

const billListEndpoints: BillListEndpoints = {
	group: (id) => `/groups/${id}/bills`,
	user: (_) => `/account/bills`,
	global: (_) => `/bills`
};

const billsApi = baseApi.injectEndpoints({
	endpoints: ({ query }) => ({
		billList: query<Bill[], { groupId: string | undefined; type: BillListType }>({
			query: ({ groupId, type }) => billListEndpoints[type](groupId),
			providesTags: ['groupBills']
		}),
		getBill: query<Bill, string | undefined>({
			query: (id) => `/bills/${id}`,
			providesTags: (result, error, id) => [{ type: 'bill', id }]
		})
	})
});

export const { useBillListQuery, useGetBillQuery } = billsApi;

export default billsApi;
