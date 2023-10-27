import { baseApi } from '../baseQuery';
import { Bill, BillCharge } from './types';

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
	endpoints: ({ query, mutation }) => ({
		billList: query<Bill[], { groupId: string | undefined; type: BillListType }>({
			query: ({ groupId, type }) => billListEndpoints[type](groupId),
			providesTags: ['bills']
		}),
		getBill: query<Bill, string | undefined>({
			query: (id) => `/bills/${id}`,
			providesTags: (_, __, id) => [{ type: 'bill', id }]
		}),
		updateCharge: mutation<void, { chargeId: number; body: Partial<BillCharge>; bill: Bill }>({
			query: ({ chargeId, body }) => ({
				url: `/charges/${chargeId}`,
				method: 'PATCH',
				body
			}),
			invalidatesTags: (_, __, { bill }) => [{ type: 'bill', id: bill.id }, 'bills'],
			onQueryStarted({ bill, body, chargeId }, { dispatch, queryFulfilled }) {
				if (bill.group_id) {
					/* Update the charge within the group bill optimistically. */
					const patch = dispatch(
						billsApi.util.updateQueryData(
							'billList',
							{ groupId: bill.group_id.toString(), type: 'group' },
							(draft) => {
								const charge = draft
									.find((b) => b.id === bill.id)
									?.charges?.find((c) => c.id === chargeId);

								if (charge) Object.assign(charge, body);
							}
						)
					);

					queryFulfilled.catch(patch.undo);
				}
			}
		})
	})
});

export const { useBillListQuery, useGetBillQuery, useUpdateChargeMutation } = billsApi;

export default billsApi;
