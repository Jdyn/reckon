import ReckonInterface from '@reckon/interface';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<Suspense>
			<ReckonInterface />
		</Suspense>
	</React.StrictMode>
);
