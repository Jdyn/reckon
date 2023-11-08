import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidePanel } from '~/components/SidePanel';

import ProfileLink from './ProfileLink';
import styles from './RightPanel.module.css';
import UserList from './UserList';
import { Flex } from '@radix-ui/themes';

const RightPanel = () => {
	const [queryParams] = useSearchParams();
	const isBillView = useMemo(() => queryParams.get('bill') !== null, [queryParams]);
	const [userListExpanded, setUserListExpanded] = useState(true);

	return (
		<SidePanel
			direction="left"
			controlled={isBillView ? true : false}
			maxWidth={isBillView ? '225px' : '225px'}
			expanded={isBillView ? true : userListExpanded}
			onExpandedChange={(e) => setUserListExpanded(e)}
		>
			{/* {isBillView ? <BillView /> : <UserList />} */}
			<Flex direction="column" height="100%" pb="4">
				<ProfileLink />
				<UserList />
			</Flex>
		</SidePanel>
	);
};

export default RightPanel;
