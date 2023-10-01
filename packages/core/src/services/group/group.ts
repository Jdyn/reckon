import { baseApi } from '../baseQuery';
import { Group } from './types';

const groupApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		getGroups: query<Group[], void>({ query: () => `/groups`, providesTags: ['groups'] }),
		getGroup: query<Group, string | undefined>({
			query: (id) => `/groups/${id}`,
			providesTags: ['group']
		}),
		createGroup: mutation<Group, Partial<Group>>({
			query: (body) => ({ url: `/groups`, method: 'POST', body }),
			invalidatesTags: ['groups']
		}),
		leaveGroup: mutation<void, string>({
			query: (id) => ({ url: `/groups/${id}/leave`, method: 'POST' }),
			invalidatesTags: ['groups']
		}),
		deleteGroup: mutation<void, string>({
			query: (id) => ({ url: `/groups/${id}`, method: 'DELETE' }),
			invalidatesTags: ['groups'],
			onQueryStarted(arg, api) {
				const { queryFulfilled } = api;
				queryFulfilled.then(() => {
					api.dispatch(groupApi.util.resetApiState());
				});
			}
		})
	})
});

export const {
	useGetGroupsQuery,
	useGetGroupQuery,
	useLazyGetGroupQuery,
	useCreateGroupMutation,
	useDeleteGroupMutation,
	useLeaveGroupMutation
} = groupApi;

export default groupApi;
