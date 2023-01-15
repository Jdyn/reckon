import { Navigate, Route, Routes } from 'react-router-dom';

import RootLayout from '~/Layout';
import HomeScreen from '~/screens/Overview';

function AppRouter() {

	return (
		<Routes>
			<Route element={<RootLayout />}>
				<Route index element={<Navigate to="/overview" />} />
				<Route path="overview" element={<HomeScreen />} />
			</Route>
		</Routes>
	);
}

export default AppRouter;