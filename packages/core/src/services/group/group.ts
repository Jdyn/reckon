import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from '../baseQuery';
import { Group } from './types';

const groupApi = createApi({
	reducerPath: 'group',
	baseQuery,
	tagTypes: ['groups', 'group'],
	endpoints: ({ query, mutation }) => ({
		getGroups: query<{ groups: Group[]}, void>({ query: () => `/groups`, providesTags: ['groups'] }),
		getGroup: query<{ group: Group}, string | undefined>({ query: (id) => `/groups/${id}`, providesTags: ['group'] }),
	})
});

export const {
	useGetGroupsQuery,
	useGetGroupQuery,
	useLazyGetGroupQuery
} = groupApi;

export default groupApi;
