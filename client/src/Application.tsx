import '@radix-ui/themes/styles.css';
import { store } from '@reckon/core';
import { Theme } from '@reckon/ui';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ErrorFallback } from '~/app/ErrorFallback';
import router from '~/app/Router';

import './assets/styles/global.css';
import '@reckon/ui/theme-config.css';

function ReckonInterface() {
	// TODO: TEMPORARY FIX, https://github.com/radix-ui/themes/issues/6
	useEffect(() => {
		const root = document.getElementById('root');
		if (root) {
			const script = root.querySelector('script');
			const scriptCopy = document.createElement('script');
			scriptCopy.innerText = script?.innerText || '';
			root.appendChild(scriptCopy);
		}
	}, []);

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Provider store={store}>
				<Theme appearance="light" grayColor="slate" radius="large" accentColor="gold" panelBackground='solid'>
					<RouterProvider router={router} />
				</Theme>
			</Provider>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
