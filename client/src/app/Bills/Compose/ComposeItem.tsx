import { ChevronLeftIcon, MinusSmallIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Flex, IconButton, Popover, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './Compose.module.css';
import { useCompose } from './ComposeProvider';
import ComposeDraft from './Draft';

export type BillForm = Pick<Bill, 'description' | 'type' | 'group_id'> & {
	charges?: {
		[user_id: number]: {
			user_id: number;
			amount: number;
		};
	};
	total?: number;
};

type ComposeItemProps = {
	itemKey: string;
	defaultValues: Partial<BillForm>;
};

const ComposeItem = ({ itemKey, defaultValues }: ComposeItemProps) => {
	const [phase, setPhase] = useState(Object.keys(defaultValues).length > 0 ? 1 : 0);

	const methods = useForm<BillForm>({
		defaultValues: defaultValues
	});

	const { watch } = methods;

	const [description, type] = watch(['description', 'type']);

	const { updateCompose, deleteCompose } = useCompose();

	const onSubmit = (data: BillForm) => {
		console.log(data);
	};

	useEffect(() => {
		const subscription = watch((data) => {
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
							}}
						>
							<XMarkIcon width="14px" />
						</IconButton>
					</Flex>
				</Flex>
			</Popover.Trigger>
			<Popover.Content className={styles.draft} sideOffset={20}>
				<Flex justify="between" pb="3">
					{phase > 0 && (
						<IconButton size="2" variant="ghost" onClick={() => setPhase((prev) => prev - 1)}>
							<ChevronLeftIcon width="18px" />
						</IconButton>
					)}
					<Text className={styles.label} size="2" weight="medium" color="orange">
						{type}
					</Text>
					<Popover.Close>
						<IconButton size="1" variant="ghost">
							<MinusSmallIcon width="18px" />
						</IconButton>
					</Popover.Close>
				</Flex>
				<FormProvider {...methods}>
					<ComposeDraft phase={phase} setPhase={setPhase} />
				</FormProvider>
			</Popover.Content>
		</Popover.Root>
	);
};

export default ComposeItem;
