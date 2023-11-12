import { CheckCircleIcon, CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Avatar, Button, Flex, ScrollArea, Select, Text, TextField } from '@radix-ui/themes';
import { useGetGroupsQuery, useMemberListQuery } from '@reckon/core';
import { getInitials } from '@reckon/ui';
import clsx from 'clsx';
import { useForm, useFormContext } from 'react-hook-form';

import styles from '../Compose.module.css';
import { BillForm } from '../ComposeItem';

interface PhaseOneProps {
	setPhase: React.Dispatch<React.SetStateAction<number>>;
}

const PhaseOne = ({ setPhase }: PhaseOneProps) => {
	const { register, watch, setValue } = useFormContext<BillForm>();
	const [group_id, charges] = watch(['group_id', 'charges']);
	const { data: groups } = useGetGroupsQuery();
	const { data: members } = useMemberListQuery(group_id!, { skip: !group_id });

	return (
		<>
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
				<Text>Which group?</Text>
				<Select.Root
					value={group_id?.toString()}
					onValueChange={(val) => {
						setValue('group_id', parseInt(val, 10));
					}}
				>
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
			<ScrollArea className={styles.container} type="scroll" scrollbars="vertical">
				<div className={styles.list}>
					{members?.map((user) => {
						const values = charges || {};
						const selected = user.id in values;

						return (
							<Flex
								key={user.id}
								gap="3"
								align="center"
								px="3"
								py="1"
								className={clsx(styles.memberCard, selected && styles.memberSelected)}
								onClick={() => {
									if (user.id in values) {
										// If it's already in charges, remove it
										delete values[user.id];
										setValue('charges', values);
									} else {
										// If it's not in charges, add it
										setValue('charges', { ...values, [user.id]: { user_id: user.id, amount: 0 } });
									}
								}}
							>
								<Avatar
									size="2"
									variant="soft"
									radius="full"
									fallback={getInitials(user.fullName)}
								/>
								<Flex justify="between" align="center" grow="1">
									<Flex direction="column">
										<Text weight="medium" size="2" trim="end">
											{user.fullName}
										</Text>
										<Text color="gray" size="1">
											{user.username}
										</Text>
									</Flex>

									{user.id in values && (
										<Flex align="center" gap="1" asChild>
											<Text color="green" weight="medium" size="2">
												Added
												<CheckCircleIcon width="18px" />
											</Text>
										</Flex>
									)}
								</Flex>
							</Flex>
						);
					})}
				</div>
			</ScrollArea>
			<Button onClick={() => setPhase(2)}>Next</Button>
		</>
	);
};

export default PhaseOne;
