import { configureStore } from '@reduxjs/toolkit';
import accountApi from './services/account/account';

export const store = configureStore({
	reducer: {
		[accountApi.reducerPath]: accountApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountApi.middleware)
});
