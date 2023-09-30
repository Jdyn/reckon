import { baseApi } from '../baseQuery';
import { Group } from './types';

const groupApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		getGroups: query<Group[], void>({ query: () => `/groups`, providesTags: ['groups'] }),
		getGroup: query<Group, string | undefined>({ query: (id) => `/groups/${id}`, providesTags: ['group'] }),
	})
});

export const {
	useGetGroupsQuery,
	useGetGroupQuery,
	useLazyGetGroupQuery
} = groupApi;

export default groupApi;
