import { useGetGroupsQuery } from '@reckon/core';
import { SideNavigationLink } from '~/components/SideMenu';

function getInitials(input: string): string {
	return input
		.split(' ')
		.map((word) => (word[0] as string).toUpperCase())
		.slice(0, 2)
		.join('');
}

const GroupList = () => {
	const { data: groups } = useGetGroupsQuery();

	return (
		<>
			{(groups || []).map((group) => (
				<SideNavigationLink key={group.id} to={`/g/${group.id}`}>
					<span>{getInitials(group.name)}</span>
				</SideNavigationLink>
			))}
		</>
	);
};

export default GroupList;
