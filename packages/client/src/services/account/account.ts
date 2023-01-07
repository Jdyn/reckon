import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from '../baseQuery';
import { Session, User } from './types';

type Nothing = Record<string, never>;

export const accountApi = createApi({
	reducerPath: 'account',
	baseQuery,
	tagTypes: ['User'],
	endpoints: (builder) => ({
		getAccount: builder.query<{ user: User }, void>({
			query: () => ({
				url: `/account`,
				method: 'GET'
			})
		}),
		getSessions: builder.query<{ sessions: Session[] }, void>({
			query: () => `/account/sessions`
		}),
		deleteSession: builder.mutation<Nothing, string>({
			query: (trackingId) => ({
				url: `/account/sessions/${trackingId}`,
				method: 'DELETE'
			})
		}),
		clearSessions: builder.mutation<Nothing, void>({
			query: () => ({
				url: `/account/sessions/clear`,
				method: 'DELETE'
			})
		})
	})
});

export const { useGetAccountQuery } = accountApi;