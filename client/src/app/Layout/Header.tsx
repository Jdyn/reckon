import { BellAlertIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button, Flex, Heading, IconButton, Text } from '@radix-ui/themes';
import { useMatch } from 'react-router-dom';

import styles from './Layout.module.css';

function Headers() {
	return (
		<Flex className={styles.header} grow="1" justify="end" align="center" px="4" gap="3">
			<IconButton variant="soft">
				<BellAlertIcon width="18px" />
			</IconButton>
			<Button type="button" variant="soft">
				<EnvelopeIcon width="18px" />
				<Text>Invites</Text>
			</Button>
		</Flex>
	);
}

export default Headers;
