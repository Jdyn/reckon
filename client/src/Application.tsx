import { Flex } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { store } from '@reckon/core';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import router from '~/app/Router';
import { ErrorFallback } from '~/components/ErrorFallback';

import './assets/styles/global.css';
import { ThemeProvider } from './hooks/ThemeProvider';

import '@reckon/ui/theme-config.css';

function ReckonInterface() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Provider store={store}>
				<PhoenixProvider>
					<ThemeProvider defaultTheme="light" storageKey="theme">
						<Flex direction="column" align="center">
							{/* <Flex height="7" justify="start" align="center" width="100%" px="5" className={styles.appHeader}>
								<Heading size="5" trim="both">Tehee</Heading>
							</Flex> */}
							<div style={{ maxWidth: '1380px', width: '100%' }}>
								<RouterProvider router={router} />
							</div>
						</Flex>
					</ThemeProvider>
				</PhoenixProvider>
			</Provider>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
