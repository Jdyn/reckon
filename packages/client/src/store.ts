import { configureStore } from '@reduxjs/toolkit';
import { accountApi } from './services';

export const store = configureStore({
	reducer: {
		[accountApi.reducerPath]: accountApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountApi.middleware)
});