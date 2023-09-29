import { RootLayout } from './Layout';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '~/app/Home';
import Group from '~/app/Group';
// import { ErrorFallback } from './ErrorFallback';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		// errorElement: <ErrorFallback />,
		children: [
			{
				index: true,
				element: <Navigate to="/feed" />
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
						element: <></>
					}
				]
			},
			{
				path: 'g',
				element: <Group />,
				children: [
					{
						path: ':id',
						element: <Group />
					},
				]
			}
		]
	}
]);

export default router;
