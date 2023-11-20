import { ChevronLeftIcon, MinusSmallIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Flex, IconButton, Popover, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './Compose.module.css';
import { ComposeItemType, useCompose } from './ComposeProvider';
import ComposeDraft from './Draft';

type ComposeItemProps = {
	itemKey: string;
	defaultValues: ComposeItemType;
};

/**
 * If the itemKey is less than 5 seconds old, it is considered newly created
 * and should be open by default on first load.
 */
const isNewlyCreated = (itemKey: string, delta = 5) => {
	return (new Date().getTime() - parseInt(itemKey)) / 1000 <= delta;
};

const ComposeItem = ({ itemKey, defaultValues }: ComposeItemProps) => {
	const [open, onOpenChange] = useState(isNewlyCreated(itemKey));
	const methods = useForm<ComposeItemType>({
		defaultValues: { ...defaultValues, phase: defaultValues.phase || 0 }
	});

	const { watch, setValue } = methods;

	const [phase, description, type] = watch(['phase', 'description', 'type']);

	const { compose } = useCompose();

	const onSubmit = (data: ComposeItemType) => {
		console.log(data);
	};

	useEffect(() => {
		const subscription = watch((data) => {
			console.log(data);
			compose.update(itemKey, data as ComposeItemType);
		});

		return () => subscription.unsubscribe();
	}, [compose, itemKey, watch]);

	return (
		<Popover.Root open={open} onOpenChange={onOpenChange}>
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
								compose.delete(itemKey);
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
						<IconButton size="2" variant="ghost" onClick={() => setValue('phase', phase - 1)}>
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
					<ComposeDraft phase={phase} />
				</FormProvider>
			</Popover.Content>
		</Popover.Root>
	);
};

export default ComposeItem;
