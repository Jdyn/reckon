import * as DropdownPrimative from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import { useGetGroupsQuery } from '@reckon/core';
import { Theme } from '@reckon/ui';
import clsx from 'clsx';

import styles from './GroupDropdown.module.css';

const GroupDropdown = () => {
	const { data } = useGetGroupsQuery();

	return (
		<DropdownPrimative.Root>
			<DropdownPrimative.Trigger className={styles.trigger}>
				<div className={styles.card}>
					<Avatar width="45px" height="45px" fallback variant='solid' />
					<span>
						Groups
						<CaretDownIcon />
					</span>
				</div>
			</DropdownPrimative.Trigger>
			<DropdownPrimative.Portal>
				<Theme asChild scaling='90%' panelBackground='solid' >
					<DropdownPrimative.Content className={clsx(styles.content)}>
						{data &&
							data.data.map((group) => (
								<DropdownPrimative.Item key={group.id} className={styles.item}>
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
