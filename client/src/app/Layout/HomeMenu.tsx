import { NewspaperIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, Text } from '@radix-ui/themes';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';

const HomeMenu = () => {
	const match = useMatch({ path: '/home', caseSensitive: false, end: false });

	return match ? (
		<SideMenuList>
			<Flex align="center" justify="between" height="6">
				<Heading size="3">Home</Heading>
			</Flex>
			<SideMenuList.Link to={match.pathname}>
				<NewspaperIcon width="18px" />
				Feed
			</SideMenuList.Link>
		</SideMenuList>
	) : null;
};

export default HomeMenu;
