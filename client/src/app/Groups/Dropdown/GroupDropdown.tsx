import * as DropdownPrimative from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { Avatar, Text } from '@radix-ui/themes';
import { Group, useGetGroupsQuery, useLazyGetGroupQuery } from '@reckon/core';
import { Theme } from '@reckon/ui';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useMatch } from 'react-router';

import styles from './GroupDropdown.module.css';

interface GroupDropdownProps {
	selectedGroup: (group: Group) => void;
}

const GroupDropdown = ({ selectedGroup }: GroupDropdownProps) => {
	const match = useMatch('/groups/:id');
	const { data: groupData } = useGetGroupsQuery();
	const [fetchGroup, { data }] = useLazyGetGroupQuery();

	useEffect(() => {
		const handleData = async (id: string) => {
			const res = await fetchGroup(id).unwrap();
			selectedGroup(res.group);
		}

		if (match?.params?.id) {
			handleData(match?.params?.id);
		}
	}, [fetchGroup, match?.params?.id, selectedGroup]);

	return (
		<DropdownPrimative.Root>
			<DropdownPrimative.Trigger className={styles.trigger}>
				<div className={styles.card}>
					<Avatar width="45px" height="45px" fallback variant="solid" />
					<span>
						{data?.group?.name || 'Groups'}
						<CaretDownIcon />
					</span>
				</div>
			</DropdownPrimative.Trigger>
			<DropdownPrimative.Portal>
				<Theme asChild scaling="90%" panelBackground="solid">
					<DropdownPrimative.Content className={clsx(styles.content)}>
						{groupData &&
							groupData.groups.map((group) => (
								<DropdownPrimative.Item
									key={group.id}
									className={styles.item}
									onClick={() => {
										// setGroup(group);
										fetchGroup(group.id);
										selectedGroup(group);
									}}
								>
									<Avatar fallback variant="solid" />
									<Text>{group.name}</Text>
								</DropdownPrimative.Item>
							))}
					</DropdownPrimative.Content>
				</Theme>
			</DropdownPrimative.Portal>
		</DropdownPrimative.Root>
	);
};

export default GroupDropdown;
