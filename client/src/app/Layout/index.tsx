import { Toast, createToaster } from '@ark-ui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Card, Flex, IconButton } from '@radix-ui/themes';
import { session } from '@reckon/core';
import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

import Compose from '../Bills/Compose';
import Header from './Header';
import styles from './Layout.module.css';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

type AuthLoader = {
	auth: ReturnType<ReturnType<typeof session.initiate>>;
};

export function RootLayout() {
	const { auth } = useLoaderData() as AuthLoader;

	const [Toaster, toast] = createToaster({
		placement: 'bottom-end',
		render(toast) {
			return (
				<Toast.Root asChild>
					<Card variant="surface" style={{ minWidth: '320px' }}>
						<Flex justify="between" align="center" pb="4">
							<Toast.Title>{toast.title}</Toast.Title>
							<Toast.CloseTrigger asChild>
								<IconButton variant="ghost">
									<XMarkIcon width="18px" />
								</IconButton>
							</Toast.CloseTrigger>
						</Flex>
						<Toast.Description>{toast.description}</Toast.Description>
					</Card>
				</Toast.Root>
			);
		}
	});

	useEffect(() => {
		auth &&
			auth.then(({ isError }) => {
				if (isError) {
					toast.create({ title: 'Error', description: 'Error logging in. Please try again.' });
				} else {
					toast.create({ title: 'Success', description: 'Successfully logged in.' });
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles.root}>
			<main className={styles.container}>
				<LeftPanel />
				<div className={styles.main}>
					<Header />
					<div className={styles.wrapper}>
						<Outlet />
						<Compose />
					</div>
				</div>
				<RightPanel />
				<Toaster />
			</main>
		</div>
	);
}
