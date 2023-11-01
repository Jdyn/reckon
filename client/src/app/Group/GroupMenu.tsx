import {
	EllipsisHorizontalIcon,
	HashtagIcon,
	NewspaperIcon,
	RectangleStackIcon,
} from '@heroicons/react/24/outline';
import {
	Button,
	Dialog,
	DropdownMenu,
	Flex,
	Heading,
	IconButton,
	Separator,
	Text,
	TextField,
} from '@radix-ui/themes';
import { useBillListQuery, useCreateCategoryMutation, useGetGroupQuery } from '@reckon/core';
import { FormEvent, FormEventHandler, useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';
import Tree from '~/components/Tree';
import { formatTimeAgo } from '~/utils/dates';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });
	const [newName, setName] = useState('');

	const groupId = useMemo(() => {
		if (!match?.params.id || isNaN(parseInt(match.params.id, 10))) return undefined;
		return parseInt(match.params.id, 10);
	}, [match]);

	const [open, setOpen] = useState({
		category: false
	});

	const [createCategory] = useCreateCategoryMutation();

	const handleDialog = (key: string, state: boolean) => {
		setOpen((prev) => ({ ...prev, [key]: state }));
	};

	const handleCreateCategory = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (groupId) {
			createCategory({ groupId, body: { name: newName } });
		}
	};

	const { data: bills } = useBillListQuery({ groupId, type: 'group' });

	const { data: group } = useGetGroupQuery(groupId, { skip: !groupId });
	console.log(open);
	return match ? (
		<SideMenuList>
			<Flex align="center" justify="between" pt="2">
				<Heading size="3">{group?.name}</Heading>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<IconButton variant="ghost">
							<EllipsisHorizontalIcon width="18px" />
						</IconButton>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content style={{ width: '216px' }}>
						<Dialog.Root
							open={open['category']}
							onOpenChange={(open) => handleDialog('category', open)}>
							<Dialog.Trigger>
								<DropdownMenu.Item
									onClick={(e) => {
										e.preventDefault();
										handleDialog('category', true);
									}}>
									Create category
									<RectangleStackIcon width="18px" />
								</DropdownMenu.Item>
							</Dialog.Trigger>
							<Dialog.Content style={{ maxWidth: 450 }}>
								<Dialog.Title align="center">Create Category</Dialog.Title>
								<Dialog.Description color="gray" align="center">
									Orangize your bills into different categories to keep them organized and easy to
									find.
								</Dialog.Description>
								<Flex direction="column" mt="3">
									<form onSubmit={handleCreateCategory}>
										<Text>Category Name</Text>
										<TextField.Input
											placeholder="New category"
											value={newName}
											onChange={(e) => setName(e.target.value)}
										/>
										<Flex gap="3" mt="4" justify="end">
											<Dialog.Close>
												<Button variant="soft" color="gray">
													cancel
												</Button>
											</Dialog.Close>
											<Button type="submit" variant="soft" color="green">
												Create
											</Button>
										</Flex>
									</form>
								</Flex>
							</Dialog.Content>
						</Dialog.Root>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Flex>

			<SideMenuList.Link to={`${match.pathname}/feed`}>
				<NewspaperIcon width="18px" />
				Feed
			</SideMenuList.Link>
			<Flex align="center" gap="1">
				<Separator size="4" />
				<Text size="1" color="gray" weight="medium" style={{ textTransform: 'uppercase' }}>
					stories
				</Text>
				<Separator size="4" />
			</Flex>
			<Flex direction="column" gap="2">
				{bills &&
					bills
						.filter((b) => b.category_id === null)
						.map((bill) => (
							<Flex key={bill.id} justify="between" style={{ margin: 0 }} asChild>
								<Button variant="ghost">
									<Flex gap="1" align="center">
										<HashtagIcon height="14px" />
										<Text size="2" weight="medium">
											{bill.description}
										</Text>
									</Flex>
									<Text>{formatTimeAgo(bill.inserted_at, false)}</Text>
								</Button>
							</Flex>
						))}
				{group?.bill_categories?.map((category) => (
					<Tree key={category.id} category={category}>
						{bills &&
							bills
								.filter((b) => b.category_id === category.id)
								.map((bill) => (
									<Flex key={bill.id} justify="between" style={{ margin: 0 }} asChild>
										<Button variant="ghost">
											<Flex gap="1" align="center">
												<HashtagIcon height="14px" />
												<Text size="2" weight="medium">
													{bill.description}
												</Text>
											</Flex>
											<Text>{formatTimeAgo(bill.inserted_at, false)}</Text>
										</Button>
									</Flex>
								))}
					</Tree>
				))}
			</Flex>
		</SideMenuList>
	) : null;
};

export default GroupMenu;
