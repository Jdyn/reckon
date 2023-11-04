import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';
import { HomeIcon, PlusIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes';
import { useCreateGroupMutation, useGetGroupsQuery } from '@reckon/core';
import { useState } from 'react';
import { SideNavigationList } from '~/components/SidePanel';

import GroupContextMenu from '../../Group/GroupContextMenu';
import VerticalMenuItem from './VerticalMenuItem';

function getInitials(input: string): string {
	return input
		.split(' ')
		.map((word) => (word.length > 0 ? (word[0] as string).toUpperCase() : word))
		.slice(0, 2)
		.join('');
}

const VerticalMenu = () => {
	const { data: groups } = useGetGroupsQuery();
	const [createGroup] = useCreateGroupMutation();
	const [form, setForm] = useState({ name: '' });

	return (
		<SideNavigationList>
			<Dialog.Root>
				<Dialog.Trigger>
					<div>
						<VerticalMenuItem tooltip="New Group">
							<PlusIcon width="24px" />
						</VerticalMenuItem>
					</div>
				</Dialog.Trigger>
				<Dialog.Content style={{ maxWidth: 450 }}>
					<Flex direction="column" gap="4">
						<Heading>New Group</Heading>
						<label>
							<Text weight="bold">Group Name</Text>
							<TextField.Input
								placeholder="Derby Gang"
								onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
								value={form.name}
							/>
						</label>
					</Flex>
					<Flex justify="end" mt="5" gap="4">
						<Dialog.Close>
							<Button variant="outline">Cancel</Button>
						</Dialog.Close>
						<Button variant="solid" onClick={() => createGroup({ name: form.name })}>
							Create
						</Button>
					</Flex>
				</Dialog.Content>
			</Dialog.Root>

			<VerticalMenuItem tooltip="For You" to="/feed">
				<GlobeEuropeAfricaIcon width="24px" height="24px" />
			</VerticalMenuItem>

			<VerticalMenuItem tooltip="Home" to="/home">
				<HomeIcon width="24px" height="24px" />
			</VerticalMenuItem>

			<Separator size="4" />

			{groups &&
				groups.map((group) => (
					<GroupContextMenu groupId={group.id} key={group.id}>
						<VerticalMenuItem key={group.id} tooltip={group.name} to={`/g/${group.id}/feed`}>
							<Text>{getInitials(group.name)}</Text>
						</VerticalMenuItem>
					</GroupContextMenu>
				))}
		</SideNavigationList>
	);
};

export default VerticalMenu;
