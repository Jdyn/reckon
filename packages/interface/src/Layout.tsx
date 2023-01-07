import { Outlet } from 'react-router-dom';

const RootLayout = () => {
	return (
		<>
			<header>header</header>
			<section>
				<Outlet />
			</section>
			<footer>footer</footer>
		</>
	);
};

export default RootLayout;
