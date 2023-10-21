import { NewspaperIcon } from '@heroicons/react/24/outline';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';
import { Text } from '@radix-ui/themes';

const HomeMenu = () => {
	const match = useMatch({ path: '/home', caseSensitive: false, end: false });

	return match ? (
		<SideMenuList>
			<Text weight="bold">Home</Text>
			<SideMenuList.Link to={match.pathname}>
				<NewspaperIcon width="18px" />
				Feed
			</SideMenuList.Link>
		</SideMenuList>
	) : null;
};

export default HomeMenu;
