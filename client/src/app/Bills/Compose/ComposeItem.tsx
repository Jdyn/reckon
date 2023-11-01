import {
	ArrowsRightLeftIcon,
	BanknotesIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	MinusSmallIcon,
	PencilSquareIcon,
	XMarkIcon
} from '@heroicons/react/24/outline';
import {
	Avatar,
	Button,
	Flex,
	Heading,
	IconButton,
	Popover,
	ScrollArea,
	Select,
	Separator,
	Tabs,
	Text,
	TextArea,
	TextField
} from '@radix-ui/themes';
import { Bill, useGetGroupsQuery, useMemberListQuery } from '@reckon/core';
import { getInitials } from '@reckon/ui';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './Compose.module.css';
import { useCompose } from './ComposeProvider';

export type BillForm = Pick<Bill, 'description' | 'type' | 'group_id'>;

type ComposeItemProps = {
	itemKey: string;
	defaultValues: Partial<BillForm>;
};

const ComposeItem = ({ itemKey, defaultValues }: ComposeItemProps) => {
	const [phase, setPhase] = useState(Object.keys(defaultValues).length > 0 ? 1 : 0);
	const { register, unregister, handleSubmit, watch, setValue } = useForm<BillForm>({
		defaultValues: defaultValues
	});

	const [description, type, group_id] = watch(['description', 'type', 'group_id']);

	const { updateCompose, deleteCompose } = useCompose();
	const { data: groups } = useGetGroupsQuery();
	const { data: members } = useMemberListQuery(group_id!, { skip: !group_id });

	const onSubmit = (data: BillForm) => {
		console.log(data);
	};

	useEffect(() => {
		const subscription = watch((data) => {
			console.log(data);
			updateCompose(itemKey, data);
		});
		return () => subscription.unsubscribe();
	}, [itemKey, updateCompose, watch]);

	return (
		<Popover.Root>
			<Popover.Trigger>
				<Flex className={styles.trigger} py="2" px="3" align="center" gap="2">
					<Text color="red" size="1" weight="bold" style={{ textTransform: 'uppercase' }}>
						Draft
					</Text>
					<Text className={styles.tabTitle} size="2" weight="medium">
						{description || 'New Bill'}
					</Text>
					<Flex gap="3">
						<IconButton
							size="1"
							variant="ghost"
							onClick={(e) => {
								e.preventDefault();
								deleteCompose(itemKey);
							}}>
							<XMarkIcon width="14px" />
						</IconButton>
					</Flex>
				</Flex>
			</Popover.Trigger>
			<Popover.Content className={styles.draft} sideOffset={20}>
				<Flex justify="between" pb="3">
					{phase > 0 ? (
						<>
							<IconButton size="2" variant="ghost" onClick={() => setPhase((prev) => prev - 1)}>
								<ChevronLeftIcon width="18px" />
							</IconButton>
							<Text className={styles.label} size="2" weight="medium" color="orange">
								{type}
							</Text>
						</>
					) : (
						<Flex />
					)}
					<Popover.Close>
						<IconButton size="1" variant="ghost">
							<MinusSmallIcon width="18px" />
						</IconButton>
					</Popover.Close>
				</Flex>
				{phase === 0 && (
					<Flex direction="column" gap="4">
						<Flex direction="column" align="center">
							<Heading>Create a bill</Heading>
							<Text color="gray" align="center">
								Your bill is where you and your friends define the story for a shared expense.
							</Text>
						</Flex>
						<Text className={styles.label} size="2" weight="medium">
							start with a type
						</Text>
						<div
							className={clsx(styles.type, type === 'split' && styles.active)}
							onClick={() => {
								setPhase(1);
								setValue('type', 'split');
							}}>
							<BanknotesIcon width="32px" />
							<Flex justify="between" grow="1">
								<Flex direction="column">
									<Text weight="bold">Split money</Text>
									<Text color="gray" size="2">
										Evenly split a specific amount between specific people.
									</Text>
								</Flex>
								<ChevronRightIcon width="24px" />
							</Flex>
						</div>

						<div
							className={clsx(styles.type, type === 'pool' && styles.active)}
							onClick={() => {
								setPhase(1);
								setValue('type', 'pool');
							}}>
							<BanknotesIcon width="32px" />
							<Flex justify="between" grow="1">
								<Flex direction="column">
									<Text weight="bold">Pool money</Text>
									<Text color="gray" size="2">
										Create a buy-in where anyone can pay a pre-set amount.
									</Text>
								</Flex>
								<ChevronRightIcon width="24px" />
							</Flex>
						</div>
					</Flex>
				)}
				{phase === 1 && (
					<Flex direction="column" gap="2">
						<Flex justify="between" gap="3">
							<TextField.Root className={styles.description} size="3">
								<TextField.Slot>
									<PencilSquareIcon width="18px" />
								</TextField.Slot>
								<TextField.Input
									placeholder="What's this bill for?"
									variant="soft"
									autoFocus
									{...register('description')}
								/>
							</TextField.Root>
						</Flex>
						<Flex direction="column">
							<Text size="2">Which group?</Text>
							<Select.Root
								value={group_id?.toString()}
								onValueChange={(val) => {
									setValue('group_id', parseInt(val, 10));
								}}>
								<Select.Trigger variant="soft">Select group</Select.Trigger>
								<Select.Content side="bottom">
									{groups?.map((group) => (
										<Select.Item key={group.id} value={group.id.toString()}>
											{group.name}
										</Select.Item>
									))}
								</Select.Content>
							</Select.Root>
						</Flex>
						<Flex className={styles.members} grow="1" style={{ height: 230 }}>
							<ScrollArea className={styles.list} type="always" scrollbars="vertical">
								<Flex direction="column" gap="3" py="3">
									{members?.map((user) => (
										<Flex key={user.id} gap="3" px="3" align="center">
											<Avatar size="2" variant="solid" radius="full" fallback={getInitials(user.fullName)} />
											<div className={styles.header}>
												<Text weight="medium" size="2" trim="end">
													{user.fullName}
												</Text>
												<Text color="gray" size="1">
													{user.username}
												</Text>
											</div>
										</Flex>
									))}
								</Flex>
							</ScrollArea>
						</Flex>
					</Flex>
				)}
			</Popover.Content>
		</Popover.Root>
	);
};

export default ComposeItem;
{
	/* <Flex direction="column">
						<Separator size="4" />
						<Flex grow="1" gap="2" align="center" py="2">
							<div className={styles.tab}>Details</div>
							<Separator size="2" orientation="vertical" />
							<div className={styles.tab}>People</div>
							<Separator size="2" orientation="vertical" />
							<div className={styles.tab}>Review</div>
						</Flex>
						<Separator size="4" />
					</Flex> */
}
