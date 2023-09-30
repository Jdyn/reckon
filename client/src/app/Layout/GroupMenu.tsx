import { MagnifyingGlassIcon, NewspaperIcon, PlusCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import {
	Button,
	Dialog,
	Flex,
	Heading,
	IconButton,
	Separator,
	Text,
	TextField,
	Tooltip
} from '@radix-ui/themes';
import { useGetGroupQuery } from '@reckon/core';
import { Link, useMatch } from 'react-router-dom';

import styles from './Layout.module.css';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });
	const { data: group } = useGetGroupQuery(match?.params.id, { skip: !match });

	return match ? (
		<div className={styles.groupMenuRoot}>
			<Heading size="4">{group?.name}</Heading>
			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="soft" highContrast>
						<UserPlusIcon width="18px" />
						Invite
					</Button>
				</Dialog.Trigger>
				<Dialog.Content style={{ maxWidth: 450 }}>
					<Dialog.Title>Invite friends to {group?.name}</Dialog.Title>
					{/* <Dialog.Description size="2" mb="4">
						Invite
					</Dialog.Description> */}
					<Flex direction="column" gap="3">
						<label>
							<Text as="div" size="2" mb="1" weight="bold">
								Identifier
							</Text>
							<TextField.Root>
								<TextField.Slot>
									<MagnifyingGlassIcon width="18px" />
								</TextField.Slot>
								<TextField.Input defaultValue="" placeholder="Phone, Email, Username" />
								<TextField.Slot>
									<Tooltip content="Send invite!">
										<IconButton size="1" variant="soft">
											<UserPlusIcon width="18px" />
										</IconButton>
									</Tooltip>
								</TextField.Slot>
							</TextField.Root>
						</label>
					</Flex>

					<Flex gap="3" mt="4" justify="end">
						<Dialog.Close>
							<Button variant="soft">Done</Button>
						</Dialog.Close>
					</Flex>
				</Dialog.Content>
			</Dialog.Root>
			<Separator size="4" />
			<Button variant="soft" highContrast asChild>
				<Link to={`${match.pathname}`}>
					<NewspaperIcon width="18px" />
					Feed
				</Link>
			</Button>
			<Button variant="soft" highContrast asChild>
				<Link to={`${match.pathname}/new`}>
					<PlusCircleIcon width="18px" />
					New
				</Link>
			</Button>
		</div>
	) : null;
};

export default GroupMenu;
