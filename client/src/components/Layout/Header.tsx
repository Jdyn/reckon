import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

import styles from './Layout.module.css';

function Headers({ expanded, setExpanded }) {
	return (
		<nav className={styles.header}>
			<button
				className={styles.collapse}
				onClick={() => setExpanded!((p) => !p)}
				data-expand={expanded}
				type="button"
			>
				<ArrowLeftOnRectangleIcon />
			</button>
		</nav>
	);
}

export default Headers;
