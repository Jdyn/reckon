import { account, store } from '@reckon/core';
import { Navigate, createBrowserRouter, redirect } from 'react-router-dom';
import Group from '~/app/Group';
import Home from '~/app/Home';

import AuthLayout from './Auth/AuthLayout';
import Login from './Auth/Login';
import Settings from './Auth/Settings';
import NewBill from './Bills/new';
import NewGroup from './Group/new';
import { RootLayout } from './Layout';

// import { ErrorFallback } from './ErrorFallback';

const authenticateUser = async () => {
	const { error } = await store.dispatch(account.initiate());
	if (error) {
		return redirect('/login');
	}

	return null;
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		loader: authenticateUser,
		children: [
			{
				index: true,
				element: <Navigate to="/feed" />
			},
			{
				path: 'home',
				element: <Home />
			},
			{
				path: 'feed',
				element: <Home />
			},
			{
				path: 'group',
				children: [
					{
						path: 'new',
						element: <NewGroup />
					}
				]
			},
			{
				path: 'g/:id',
				children: [
					{
						index: true,
						element: <Navigate to="feed" />
					},
					{
						path: 'feed',
						element: <Group />
					},
					{
						path: 'new',
						element: <NewBill />
					}
				]
			},
			{
				path: 'settings',
				element: <Settings />
			}
		]
	},
	{
		path: '/',
		element: <AuthLayout />,
		children: [
			{
				path: 'login',
				element: <Login />
			}
		]
	}
]);

export default router;
