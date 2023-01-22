import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from '../baseQuery';
import { Session, User } from './types';

type Empty = Record<string, never>;

export const accountApi = createApi({
	reducerPath: 'account',
	baseQuery,
	endpoints: ({ query, mutation }) => ({
		getAccount: query<{ user: User }, void>({ query: () => `/account` }),
		getSessions: query<{ sessions: Session[] }, void>({ query: () => `/account/sessions` }),
		deleteSession: mutation<Empty, string>({
			query: (trackingId) => ({
				url: `/account/sessions/${trackingId}`,
				method: 'DELETE'
			})
		}),
		clearSessions: mutation<Empty, void>({
			query: () => ({
				url: `/account/sessions/clear`,
				method: 'DELETE'
			})
		})
	})
});

export const { useGetAccountQuery, useDeleteSessionMutation } = accountApi;
