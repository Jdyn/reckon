import { RootLayout } from './Layout';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '~/app/Home';
import Group from '~/app/Groups';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
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
