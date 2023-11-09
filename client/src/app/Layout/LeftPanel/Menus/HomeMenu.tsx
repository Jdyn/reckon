import { NewspaperIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, Text } from '@radix-ui/themes';
import { NavLink, useMatch } from 'react-router-dom';
import { useSidePanel } from '~/components/SidePanel';

import styles from './Menu.module.css';

const HomeMenu = () => {
	const match = useMatch({ path: '/home', caseSensitive: false, end: false });

	return match ? (
		<div className={styles.root}>
			<Flex align="center" height="6" justify="between" mt="4" mx="2">
				<Heading size="4">Home</Heading>
			</Flex>
			<NavLink className={styles.listItem} to={`${match.pathname}`}>
				<Flex gap="1" align="center">
					<NewspaperIcon width="18px" />
					<Text weight="medium">Feed</Text>
				</Flex>
			</NavLink>
		</div>
	) : null;
};

export default HomeMenu;
