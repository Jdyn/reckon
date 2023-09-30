import { Outlet } from 'react-router';

const AuthLayout = () => {
	return (
		<div style={{ height: '100vh'}}>
			<Outlet />
		</div>
	);
};

export default AuthLayout;
