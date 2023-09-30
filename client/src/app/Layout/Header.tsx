import { Heading, Text } from '@radix-ui/themes';
import { useMatch } from 'react-router-dom';

import styles from './Layout.module.css';

function Headers() {

	return (
		<nav className={styles.header}>
			{/* <Heading>{groupMatch && <Text>Group {groupMatch.params.id}</Text>}</Heading> */}
		</nav>
	);
}

export default Headers;
