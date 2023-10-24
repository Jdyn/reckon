import { User } from '../account';
import { baseApi } from '../baseQuery';
import { Group, GroupInvitePayload } from './types';

const groupApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		getGroups: query<Group[], void>({ query: () => `/groups`, providesTags: ['groups'] }),
		getGroup: query<Group, string | undefined>({
			query: (id) => `/groups/${id}`,
			providesTags: (result, error, arg) => [{ type: 'group', id: arg }]
		}),
		createGroup: mutation<Group, Partial<Group>>({
			query: (body) => ({ url: `/groups`, method: 'POST', body }),
			invalidatesTags: ['groups']
		}),
		leaveGroup: mutation<void, string>({
			query: (id) => ({ url: `/groups/${id}/leave`, method: 'DELETE' }),
			invalidatesTags: ['groups']
		}),
		deleteGroup: mutation<void, string>({
			query: (id) => ({ url: `/groups/${id}`, method: 'DELETE' }),
			invalidatesTags: (_result, _error, arg) => ['groups', { type: 'group', id: arg }]
		}),
		joinGroup: mutation<void, { groupId: string }>({
			query: ({ groupId }) => ({ url: `/groups/${groupId}/join`, method: 'POST' }),
			invalidatesTags: ['groups']
		}),
		InviteUser: mutation<void, GroupInvitePayload>({
			query: ({ groupId, body }) => ({ url: `/groups/${groupId}/join`, method: 'POST', body })
		}),
		memberList: query<User[], string | undefined>({
			query: (groupId) => `/groups/${groupId}/members`,
			providesTags: ['groupMembers']
		})
	})
});

export const {
	useGetGroupsQuery,
	useGetGroupQuery,
	useLazyGetGroupQuery,
	useCreateGroupMutation,
	useDeleteGroupMutation,
	useLeaveGroupMutation,
	useInviteUserMutation,
	useJoinGroupMutation,
	useMemberListQuery
} = groupApi;

export default groupApi;
