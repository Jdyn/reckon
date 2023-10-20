import { ArchiveBoxIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
	Callout,
	Flex,
	Heading,
	Separator,
	Switch,
	Text,
	TextArea,
	TextField
} from '@radix-ui/themes';
import clsx from 'clsx';
import { useState } from 'react';

import styles from './new.module.css';

const NewBill = () => {
	const [type, setType] = useState<'split' | 'pot'>('split');
	const [showBreakdown, setShowBreakdown] = useState(false);

	return (
		<>
			<Heading my="4" mx="4">
				Create a bill
			</Heading>
			<Separator size="4" />
			<Flex direction="column" py="2" align="center">
				<Flex direction="column" style={{ maxWidth: '450px' }}>
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
									? 'A split has a pre-set total and splits it among everyone.'
									: 'A pot has no pre-set total and everyone pays a set amount.'}
							</Callout.Text>
						</Callout.Root>
					</Flex>
					<Separator size="4" />
					{type === 'split' && (
						<>
							<Flex direction="column" grow="1" gap="1" py="3" asChild>
								<label>
									<Flex justify="between" align="center">
										<Heading size="3">Total</Heading>
										<Text size="2" color="gray">
											The total amount to be split
										</Text>
									</Flex>
									<TextField.Input variant="soft" type="number" placeholder="0.00" />
								</label>
							</Flex>
							<Flex direction="column" grow="1" gap="1" py="3" asChild>
								<label>
									<Flex justify="between" align="center">
										<Heading size="3">Description</Heading>
										<Text size="2" color="gray">
											{"What's this for?"}
										</Text>
									</Flex>
									<TextArea variant="soft" placeholder="Boba with the boys" />
								</label>
							</Flex>
							<Flex align="center" gap="3" direction="column">
								<Flex width="100%" direction="row" align="center" justify="between">
									<Heading size="3">Breakdown</Heading>
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
											Optional details to breakdown the total in a meaningful way.
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
			</Flex>
		</>
	);
};

export default NewBill;
