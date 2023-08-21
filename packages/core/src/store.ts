import { configureStore } from '@reduxjs/toolkit';
import accountApi from './services/account/account';
import groupApi from './services/group/group';

export const store = configureStore({
	reducer: {
		[accountApi.reducerPath]: accountApi.reducer,
		[groupApi.reducerPath]: groupApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountApi.middleware).concat(groupApi.middleware)
});
