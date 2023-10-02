import {
	ArchiveBoxIcon,
	CurrencyDollarIcon,
	ExclamationCircleIcon,
	UserGroupIcon
} from '@heroicons/react/24/outline';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
	Callout,
	Flex,
	Heading,
	IconButton,
	Separator,
	Switch,
	Text,
	TextArea,
	TextField,
	Tooltip
} from '@radix-ui/themes';
import clsx from 'clsx';
import { useState } from 'react';

import styles from './new.module.css';

const NewBill = () => {
	const [type, setType] = useState<'split' | 'pot'>('split');
	const [showBreakdown, setShowBreakdown] = useState(false);

	return (
		<Flex direction="column" py="2" px="4">
			<Heading my="4">Create a bill</Heading>
			<Separator size="4" />
			<Flex direction="column" gap="4" my="3">
				<Flex gap="4" justify="center">
					<button
						className={clsx(styles.billType, type === 'split' && styles.active)}
						onClick={() => setType('split')}
					>
						<UserGroupIcon width="32px" />
						Split
					</button>
					<button
						className={clsx(styles.billType, type === 'pot' && styles.active)}
						onClick={() => setType('pot')}
					>
						<ArchiveBoxIcon width="32px" />
						Pot
					</button>
				</Flex>
				<Callout.Root className={styles.callout}>
					<Callout.Icon>
						<InfoCircledIcon height="18px" />
					</Callout.Icon>
					<Callout.Text align="center" size="2">
						{/* <Heading size="2">{type === 'split' ? 'Split' : 'Pot'}</Heading> */}
						{type === 'split'
							? 'A split takes a pre-set total and splits the total among specific people.'
							: 'A pot takes no total and expects everyone to pay a pre-set amount.'}
					</Callout.Text>
				</Callout.Root>
			</Flex>
			<Separator size="4" />
			{type === 'split' && (
				<>
					<Flex direction="column" grow="1" gap="1" py="3" asChild>
						<label>
							<Flex justify="between" align="center">
								<Heading size="5">Total</Heading>
								<Text size="2" color="gray">
									The total amount to be split
								</Text>
							</Flex>
							<TextField.Root>
								<TextField.Slot>
									<CurrencyDollarIcon width="18px" />
								</TextField.Slot>
								<TextField.Input size="3" variant="soft" type="number" placeholder="0.00" />
							</TextField.Root>
						</label>
					</Flex>
					<Flex direction="column" grow="1" gap="1" py="3" asChild>
						<label>
							<Flex justify="between" align="center">
								<Heading size="5">Description</Heading>
								<Text size="2" color="gray">
									{"What's this for?"}
								</Text>
							</Flex>
							<TextArea variant="soft" placeholder="Boba with the boys" />
						</label>
					</Flex>
					<Flex align="center" gap="3" direction="column">
						<Flex width="100%" direction="row" align="center" justify="between">
							<Heading size="5">Breakdown</Heading>
							<Switch
								variant="soft"
								radius="full"
								onClick={() => {
									setShowBreakdown((v) => !v);
								}}
							></Switch>
						</Flex>
						{showBreakdown ? (
							<Flex></Flex>
						) : (
							<Callout.Root className={styles.callout}>
								<Callout.Icon>
									<InfoCircledIcon height="18px" />
								</Callout.Icon>
								<Callout.Text align="center" size="2">
									Optional details to breakdown the total in a meaningful way to the group.
								</Callout.Text>
							</Callout.Root>
						)}
					</Flex>

					{/* <Flex direction="column" grow="1" gap="1" py="3" asChild>
						<label>
							<Flex justify="between" align="center">
								<Heading size="5">Items</Heading>
								<Text size="2" color="gray">
									{"What's this for?"}
								</Text>
							</Flex>
							<TextArea variant="soft" placeholder="Boba with the boys" />
						</label>
					</Flex> */}
				</>
			)}
		</Flex>
	);
};

export default NewBill;
