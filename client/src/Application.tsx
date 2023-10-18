import { Container } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { store } from '@reckon/core';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import { ErrorFallback } from '~/app/ErrorFallback';
import router from '~/app/Router';

import './assets/styles/global.css';
import { ThemeProvider } from './hooks/ThemeProvider';

import '@reckon/ui/theme-config.css';

function ReckonInterface() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Provider store={store}>
				<PhoenixProvider>
					<ThemeProvider defaultTheme="light" storageKey="theme">
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<div style={{ maxWidth: '1540px', width: '100%'}}>
							<RouterProvider router={router} />
							</div>
						</div>
					</ThemeProvider>
				</PhoenixProvider>
			</Provider>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
