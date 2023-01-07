import { configureStore } from '@reduxjs/toolkit';

import { accountApi } from './services/account';

export const store = configureStore({
	reducer: {
		[accountApi.reducerPath]: accountApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountApi.middleware)
});

// export * from "./hooks";
export * from './services';
export const { useGetAccountQuery } = accountApi;
