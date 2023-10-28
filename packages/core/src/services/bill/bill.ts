import { baseApi } from '../baseQuery';
import { Bill, BillCharge } from './types';

export type BillListType = 'group' | 'user' | 'global';

type BillListEndpoints = {
	[key in BillListType]: (id: number | undefined) => string;
};

const billListEndpoints: BillListEndpoints = {
	group: (id) => `/groups/${id}/bills`,
	user: (_) => `/account/bills`,
	global: (_) => `/bills`
};

const billsApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		billList: query<Bill[], { groupId?: number; type: BillListType }>({
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
							{ groupId: bill.group_id, type: 'group' },
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
		}),
		likeBill: mutation<void, { billId: number; meta?: { groupId?: number } }>({
			query: ({ billId }) => ({
				url: `/bills/${billId}/like`,
				method: 'POST'
			}),
			/* We are doing this because we want to save round trips to the server
					by avoiding refetching a new feed of bills just because we liked */
			onQueryStarted({ billId, meta }, { dispatch }) {
				const { updateQueryData } = billsApi.util;
				dispatch(
					updateQueryData('billList', { type: 'global' }, (draft) => {
						updateLikes(draft, billId);
					})
				);
				dispatch(
					updateQueryData('billList', { type: 'user' }, (draft) => {
						updateLikes(draft, billId);
					})
				);

				if (meta?.groupId) {
					dispatch(
						updateQueryData('billList', { groupId: meta.groupId, type: 'group' }, (draft) => {
							updateLikes(draft, billId);
						})
					);
				}
			}
		})
	})
});

/* Optimistically update the like count of the bill so we dont
		have to refetch the entire list or bill again */
const updateLikes = (draft: Bill[], billId: number) => {
	const bill = draft.find((b) => b.id === billId);
	if (bill) {
		const liked = !bill.liked;
		Object.assign(bill, {
			liked,
			like_count: liked ? bill.like_count + 1 : bill.like_count - 1
		});
	}
};

export const { useBillListQuery, useGetBillQuery, useUpdateChargeMutation, useLikeBillMutation } =
	billsApi;

export default billsApi;
