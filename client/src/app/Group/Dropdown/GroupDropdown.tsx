import * as DropdownPrimative from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { Avatar, Text } from '@radix-ui/themes';
import { Group, useGetGroupQuery, useGetGroupsQuery, useLazyGetGroupQuery } from '@reckon/core';
import { Theme } from '@reckon/ui';
import clsx from 'clsx';

import styles from './GroupDropdown.module.css';
import { useState } from 'react';

interface GroupDropdownProps {
	selectedGroup: (group: Group) => void;
}

const GroupDropdown = ({ selectedGroup }: GroupDropdownProps) => {
	const [currentGroup, setGroup] = useState<Group | null>(null);
	const { data } = useGetGroupsQuery();
	const [fetchGroup] = useLazyGetGroupQuery();

	return (
		<DropdownPrimative.Root>
			<DropdownPrimative.Trigger className={styles.trigger}>
				<div className={styles.card}>
					<Avatar width="45px" height="45px" fallback variant='solid' />
					<span>
						{currentGroup?.name}
						<CaretDownIcon />
					</span>
				</div>
			</DropdownPrimative.Trigger>
			<DropdownPrimative.Portal>
				<Theme asChild scaling='90%' panelBackground='solid' >
					<DropdownPrimative.Content className={clsx(styles.content)}>
						{data &&
							data.data.map((group) => (
								<DropdownPrimative.Item key={group.id} className={styles.item} onClick={() => {
									setGroup(group);
									fetchGroup(group.id)
									selectedGroup(group);
								}}>
									<Avatar fallback variant='solid' />
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
