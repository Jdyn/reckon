import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Avatar, Button, Flex, ScrollArea, Text } from '@radix-ui/themes';
import { useMemberListQuery } from '@reckon/core';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getInitials } from '~/components/Avatar';
import { NumberInput } from '~/components/NumberInput';
import { money as createMoney } from 'money-lib/v2';

import styles from '../Compose.module.css';
import { ComposeItemType } from '../ComposeProvider';
import { evenSplit } from '../service';

const PhaseTwo = () => {
	const { watch, setValue } = useFormContext<ComposeItemType>();
	const [group_id, charges, total] = watch(['group_id', 'charges', 'total']);

	const { data: members } = useMemberListQuery(group_id!, { skip: !group_id });

	// const chargeSum = () => Object.keys(charges || {}).reduce((acc, id) => acc + parseFloat(charges[id].amount), 0);

	return (
		<>
			<Flex
				align="center"
				justify="between"
				px="0"
				className={clsx(styles.memberCard, styles.switcher)}
			>
				<Flex gap="3" align="center">
					<div className={styles.switch}>
						<ArrowsRightLeftIcon width="18px" />
					</div>
					<Text weight="medium" trim="both">
						Total
					</Text>
				</Flex>
				<NumberInput
					name="total"
					min={0}
					formatOptions={{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}}
					allowMouseWheel
					money
					onValueChange={({ value }) => {
						const { newCharges, split } = evenSplit(charges as any, value);
						setValue('charges', newCharges);
					}}
				/>
			</Flex>

			<ScrollArea type="scroll" scrollbars="vertical" style={{ margin: '0 calc(var(--space-3) * -1)', width: 'auto'}}>
				<Flex direction="column" gap="3" p="3">
					{members
						?.filter((u) => Object.keys(charges || {})?.some((id) => parseInt(id) === u.id))
						?.map((user) => {
							const chargeAmount = charges?.[user.id]?.amount || '0';

							return (
								<Flex
									key={user.id}
									align="center"
									justify="between"
									p="0"
									className={clsx(styles.memberCard)}
								>
									<Flex gap="3">
										<Avatar
											size="2"
											variant="soft"
											radius="full"
											fallback={getInitials(user.fullName)}
										/>
										<Flex direction="column">
											<Text weight="medium" trim="both">
												{user.fullName}
											</Text>
											<Text color="gray" size="2">
												{user.username}
											</Text>
										</Flex>
									</Flex>
									<NumberInput
										name={`charges.${user.id}.amount`}
										min={0}
										formatOptions={{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										}}
										allowMouseWheel
										money
										onValueChange={({ value }) => {
											const newValue = createMoney(value as any, 'USD').sub(chargeAmount as any);
											const newTotal = createMoney(total as any, 'USD').add(newValue);
											setValue('total', newTotal.string())
										}}
									/>
								</Flex>
							);
						})}
				</Flex>
			</ScrollArea>
			<Button onClick={() => setValue('phase', 2)}>Next</Button>
		</>
	);
};

export default PhaseTwo;
