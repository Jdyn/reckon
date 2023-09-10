import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from '../baseQuery';
import { Session, SignInPayload, SignUpPayload, User } from './types';

type Empty = Record<string, never>;

const accountApi = createApi({
	reducerPath: 'account',
	baseQuery,
	tagTypes: ['user', 'sessions', 'session'],
	endpoints: ({ query, mutation }) => ({
		account: query<{ user: User }, void>({ query: () => `/account`, providesTags: ['user'] }),
		session: query<{ session: Session }, void>({
			query: () => `/account/session`,
			providesTags: ['session']
		}),
		sessions: query<{ sessions: Session[] }, void>({
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
				url: `/account/sessions`,
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
		SignUp: mutation<{ user: User }, SignUpPayload>({
			query: (body) => ({
				url: `/account/signup`,
				method: 'POST',
				body
			})
		}),
		SignIn: mutation<{ user: User }, SignInPayload>({
			query: (body) => ({
				url: '/account/signin',
				method: 'POST',
				body
			}),
			invalidatesTags: ['sessions']
		}),
		SignOut: mutation<Empty, void>({
			query: () => ({
				url: '/account/signout',
				method: 'DELETE'
			}),
			invalidatesTags: ['sessions'],
		})
	})
});


export const {
	useAccountQuery,
	useSessionQuery,
	useSessionsQuery,
	useDeleteSessionMutation,
	useClearSessionsMutation,
	useSendEmailConfirmationQuery,
	useDoEmailConfirmationMutation,
	useSignUpMutation,
	useSignInMutation,
	useSignOutMutation
} = accountApi;

export default accountApi;
