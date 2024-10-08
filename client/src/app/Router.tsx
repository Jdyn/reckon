import { session, store } from '@reckon/core';
import { Navigate, createBrowserRouter, defer, redirect } from 'react-router-dom';

import AuthLayout from './Auth/AuthLayout';
import Login from './Auth/Login';
import Settings from './Auth/Settings';
import BillFeed from './Bills/BillFeed';
import Compose from './Bills/Compose';
import { RootLayout } from './Layout';

const protectRoute = async () => {
	const auth = store.dispatch(session.initiate());

	return defer({ auth });
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		loader: protectRoute,
		children: [
			{ index: true, element: <Navigate to="/feed" /> },
			{ path: 'home', element: <BillFeed type="user" /> },
			{ path: 'feed', element: <BillFeed type="global" /> },
			{ path: 'g/:id/feed', element: <BillFeed type="group" /> },
			{ path: 'g/:id/bill/:billId', element: <Settings />},
			{ path: 'settings', element: <Settings /> },
			{ path: '/bill/new', element: <Compose /> }
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
