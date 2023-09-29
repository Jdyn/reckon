import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@radix-ui/react-icons';
import { Separator } from '@radix-ui/themes';
import { useGetGroupsQuery } from '@reckon/core';
import { Background } from '@reckon/ui';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import GroupMemberList from '~/app/Groups/MemberList';

import { SideMenu, SideMenuContext, SideNavigationLink, SideNavigationList } from '../SideMenu';
import Header from './Header';
import styles from './Layout.module.css';

function getInitials(input: string): string {
	return input
		.split(' ')
		.map((word) => (word[0] as string).toUpperCase())
		.slice(0, 2)
		.join('');
}

export function RootLayout() {
	const { data: groups } = useGetGroupsQuery();
	const [expanded, setExpanded] = useState(true);

	// const ArrowIcon = useMemo(
	// 	() =>
	// 		expanded && expand === 'left' ? (
	// 			<ArrowRightOnRectangleIcon width="24px" height="24px" />
	// 		) : expanded && expand === 'right' ? (
	// 			<ArrowLeftOnRectangleIcon width="24px" height="24px" />
	// 		) : expand === 'left' ? (
	// 			<ArrowLeftOnRectangleIcon width="24px" height="24px" />
	// 		) : (
	// 			<ArrowRightOnRectangleIcon width="24px" height="24px" />
	// 		),
	// 	[expanded, expand]
	// );

	return (
		<PhoenixProvider>
			<SideMenuContext.Provider value={{ expanded, setExpanded }}>
				<div className={styles.root}>
					<main className={styles.main}>
						<Header expanded={expanded} setExpanded={setExpanded} />
						<SideMenu expand="right">
							<div className={styles.container}>
								<SideNavigationList>
									<SideNavigationLink to="/groups/new">
										<PlusIcon width="24px" height="24px" />
									</SideNavigationLink>
									<SideNavigationLink to={`/feed`}>
										<HomeIcon width="24px" height="24px" />
									</SideNavigationLink>
									<Separator size="4" />
									{(groups || []).map((group) => (
										<SideNavigationLink key={group.id} to={`/groups/${group.id}`}>
											<span>{getInitials(group.name)}</span>
										</SideNavigationLink>
									))}
								</SideNavigationList>
							</div>
						</SideMenu>
						<div className={styles.container}>
							<div className={styles.wrapper}>
								<Outlet />
							</div>
						</div>
						{/* <SideMenu expand="left">
							<GroupMemberList />
						</SideMenu> */}
					</main>
					{/* <Background /> */}
				</div>
			</SideMenuContext.Provider>
		</PhoenixProvider>
	);
}
