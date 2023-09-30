import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Button, Heading } from '@radix-ui/themes';
import { useGetGroupQuery } from '@reckon/core';
import { useMatch } from 'react-router-dom';

import styles from './Layout.module.css';

const GroupMenu = () => {
	const match = useMatch('/g/:id');
	const { data: group } = useGetGroupQuery(match?.params.id, { skip: !match });

	return (
		<div className={styles.groupMenuRoot}>
			<Heading size="4">{group?.name}</Heading>
			<Button variant="soft" highContrast>
				<UserPlusIcon width="18px" />
				Invite
			</Button>
		</div>
	);
};

export default GroupMenu;
