import { User } from '../account';
import { baseApi } from '../baseQuery';
import { Group, GroupInvitePayload } from './types';

const groupApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		getGroups: query<Group[], void>({ query: () => `/groups`, providesTags: ['groups'] }),
		getGroup: query<Group, number | undefined>({
			query: (id) => `/groups/${id}`,
			providesTags: (result, error, arg) => [{ type: 'group', id: arg }]
		}),
		createGroup: mutation<Group, Partial<Group>>({
			query: (body) => ({ url: `/groups`, method: 'POST', body }),
			invalidatesTags: ['groups']
		}),
		leaveGroup: mutation<void, number>({
			query: (id) => ({ url: `/groups/${id}/leave`, method: 'DELETE' }),
			invalidatesTags: ['groups']
		}),
		deleteGroup: mutation<void, number>({
			query: (id) => ({ url: `/groups/${id}`, method: 'DELETE' }),
			invalidatesTags: (_result, _error, arg) => ['groups', { type: 'group', id: arg }]
		}),
		joinGroup: mutation<void, { groupId: number }>({
			query: ({ groupId }) => ({ url: `/groups/${groupId}/join`, method: 'POST' }),
			invalidatesTags: ['groups']
		}),
		InviteUser: mutation<void, GroupInvitePayload>({
			query: ({ groupId, body }) => ({ url: `/groups/${groupId}/invite`, method: 'POST', body })
		}),
		memberList: query<User[], string | undefined>({
			query: (groupId) => `/groups/${groupId}/members`,
			providesTags: ['groupMembers']
		}),
		createCategory: mutation<void, { groupId: number; body: { name: string } }>({
			query: ({ groupId, body }) => ({
				url: `/groups/${groupId}/categories`,
				method: 'POST',
				body
			}),
			invalidatesTags: (_result, _error, { groupId }) => [{ type: 'group', id: groupId }]
		}),
		deleteCategory: mutation<void, { groupId: number; categoryId: number }>({
			query: ({ groupId, categoryId }) => ({
				url: `/groups/${groupId}/categories/${categoryId}`,
				method: 'DELETE'
			}),
			invalidatesTags: (_result, _error, { groupId }) => [{ type: 'group', id: groupId }]
		})
	})
});

export const {
	useGetGroupsQuery,
	useGetGroupQuery,
	useCreateGroupMutation,
	useDeleteGroupMutation,
	useLeaveGroupMutation,
	useInviteUserMutation,
	useJoinGroupMutation,
	useMemberListQuery,
	useCreateCategoryMutation,
	useDeleteCategoryMutation
} = groupApi;

export default groupApi;
