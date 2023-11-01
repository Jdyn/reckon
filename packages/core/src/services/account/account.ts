import { baseApi } from '../baseQuery';
import { Session, SignInPayload, SignUpPayload, User } from './types';

type Empty = Record<string, never>;

export const accountApi = baseApi.injectEndpoints({
	endpoints: ({ query, mutation }) => ({
		session: query<Session & { user: User }, void>({
			query: () => `/account/session`,
			providesTags: ['session']
		}),
		sessions: query<Session[], void>({
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
		SignIn: mutation<void, SignInPayload>({
			query: (body) => ({
				url: '/account/signin',
				method: 'POST',
				body
			}),
			invalidatesTags: ['user', 'sessions']
		}),
		SignOut: mutation<Empty, void>({
			query: () => ({
				url: '/account/signout',
				method: 'DELETE'
			}),
			onQueryStarted(arg, api) {
				const { queryFulfilled } = api;
				queryFulfilled.then(() => {
					api.dispatch(accountApi.util.resetApiState());
				});
			}
		})
	})
});

export const {
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

export const { session } = accountApi.endpoints;
