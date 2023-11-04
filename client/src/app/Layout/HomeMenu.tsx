import { NewspaperIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, Text } from '@radix-ui/themes';
import { useMatch } from 'react-router-dom';
import { useSidePanel } from '~/components/SidePanel';
import SideMenuList from '~/components/SidePanel/SideMenuList';

const HomeMenu = () => {
	const match = useMatch({ path: '/home', caseSensitive: false, end: false });
	const { expanded } = useSidePanel();

	return match ? (
		<SideMenuList>
			<Flex align="center" justify="between" pt="2">
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
