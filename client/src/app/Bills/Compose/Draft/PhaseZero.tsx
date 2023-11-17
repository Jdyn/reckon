import { BanknotesIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

import styles from '../Compose.module.css';
import { ComposeItemType } from '../ComposeProvider';

const PhaseOne = () => {
	const { watch, setValue } = useFormContext<ComposeItemType>();
	const [group_id, type] = watch(['group_id', 'type']);

	return (
		<>
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
						setValue('phase', 1);
						setValue('type', 'split');
					}}
				>
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
						setValue('phase', 1);
						setValue('type', 'pool');
					}}
				>
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
		</>
	);
};

export default PhaseOne;
