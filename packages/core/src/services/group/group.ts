import { baseApi } from '../baseQuery';
import { Group } from './types';

const groupApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		getGroups: query<Group[], void>({ query: () => `/groups`, providesTags: ['groups'] }),
		getGroup: query<Group, string | undefined>({ query: (id) => `/groups/${id}`, providesTags: ['group'] }),
		createGroup: mutation<Group, Partial<Group>>({ query: (body) => ({ url: `/groups`, method: 'POST', body }), invalidatesTags: ['groups'] }),
	})
});

export const {
	useGetGroupsQuery,
	useGetGroupQuery,
	useLazyGetGroupQuery,
	useCreateGroupMutation
} = groupApi;

export default groupApi;
