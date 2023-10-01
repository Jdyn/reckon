import { baseApi } from '../baseQuery';
import { Group } from './types';

const groupApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		getGroups: query<Group[], void>({ query: () => `/groups`, providesTags: ['groups'] }),
		getGroup: query<Group, string | undefined>({
			query: (id) => `/groups/${id}`,
			providesTags: (result, error, arg) => [{type: 'group', id: arg }]
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
			invalidatesTags: (_result, _error, arg) => ['groups', {type: 'group', id: arg}],
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
