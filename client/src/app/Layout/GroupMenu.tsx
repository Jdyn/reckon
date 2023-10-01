import {
	MagnifyingGlassIcon,
	NewspaperIcon,
	PlusCircleIcon,
	UserPlusIcon
} from '@heroicons/react/24/outline';
import { Button, Dialog, Flex, IconButton, Text, TextField, Tooltip } from '@radix-ui/themes';
import { useGetGroupQuery } from '@reckon/core';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });
	const { data: group } = useGetGroupQuery(match?.params.id, { skip: !match });

	return match ? (
		<SideMenuList>
			<>
				{group?.name}
				<Dialog.Root>
					<Dialog.Trigger>
						<IconButton variant="soft" highContrast>
							<UserPlusIcon width="18px" />
						</IconButton>
					</Dialog.Trigger>
					<Dialog.Content style={{ maxWidth: 450 }}>
						<Dialog.Title>Invite friends to {group?.name}</Dialog.Title>
						<Flex direction="column">
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
			</>
			<SideMenuList.Link to={`${match.pathname}/feed`}>
				<NewspaperIcon width="18px" />
				Feed
			</SideMenuList.Link>
			<SideMenuList.Link to={`${match.pathname}/new`}>
				<PlusCircleIcon width="18px" />
				New
			</SideMenuList.Link>
		</SideMenuList>
	) : null;
};

export default GroupMenu;
