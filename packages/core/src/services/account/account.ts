import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from '../baseQuery';
import { Session, SignInPayload, SignUpPayload, User } from './types';

type Empty = Record<string, never>;

const accountApi = createApi({
	reducerPath: 'account',
	baseQuery,
	tagTypes: ['user', 'sessions'],
	endpoints: ({ query, mutation }) => ({
		getAccount: query<{ user: User }, void>({ query: () => `/account`, providesTags: ['user'] }),
		getSessions: query<{ sessions: Session[] }, void>({
			query: () => `/account/sessions`,
			providesTags: ['sessions']
		}),
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
			}),
			invalidatesTags: ['sessions']
		}),
		sendEmailConfirmation: query<Empty, void>({ query: () => '/account/email/confirm' }),
		doEmailConfirmation: mutation<Empty, string>({
			query: (token) => ({
				url: `/account/email/confirmation/${token}`,
				method: 'POST'
			})
		}),
		accountSignUp: mutation<{ user: User }, SignUpPayload>({
			query: (body) => ({
				url: `/account/signup`,
				method: 'POST',
				body
			})
		}),
		accountSignIn: mutation<{ user: User }, SignInPayload>({
			query: (body) => ({
				url: '/account/signin',
				method: 'POST',
				body
			}),
			invalidatesTags: ['sessions']
		}),
		accountSignOut: mutation<Empty, void>({
			query: () => ({
				url: '/account/signout',
				method: 'DELETE'
			})
		})
	})
});


export const {
	useGetAccountQuery,
	useGetSessionsQuery,
	useDeleteSessionMutation,
	useClearSessionsMutation,
	useSendEmailConfirmationQuery,
	useDoEmailConfirmationMutation,
	useAccountSignUpMutation,
	useAccountSignInMutation,
	useAccountSignOutMutation
} = accountApi;

export default accountApi;
