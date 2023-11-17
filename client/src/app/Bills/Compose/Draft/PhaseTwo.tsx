import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import { useMemberListQuery } from '@reckon/core';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getInitials } from '~/components/Avatar';
import { NumberInput } from '~/components/NumberInput';

import styles from '../Compose.module.css';
import { deepEqual, evenSplit, perPersonSplit } from '../service';
import { ComposeItemType } from '../ComposeProvider';

const PhaseTwo = () => {
	const [splitType, setType] = useState<'total' | 'person'>('total');
	const { watch, setValue } = useFormContext<ComposeItemType>();
	const [group_id, charges, total, splitAmount] = watch([
		'group_id',
		'charges',
		'total',
		'splitAmount'
	]);

	const { data: members } = useMemberListQuery(group_id!, { skip: !group_id });

	const bulkUpdateCharges = (
		charges: Record<string, any>,
		total: string | undefined,
		type: 'total' | 'person'
	) => {
		if (total && charges) {
			if (type === 'total') {
				const { newCharges, split } = evenSplit(charges, total);

				if (deepEqual(charges, newCharges)) return;

				setValue('charges', newCharges);
				setValue('splitAmount', split);
			} else {
				if (splitAmount) {
					const newCharges = perPersonSplit(charges, splitAmount);
					console.log(newCharges);
					setValue('charges', newCharges);
					const newTotal = (parseInt(splitAmount) * Object.keys(newCharges).length).toString();
					setValue('total', newTotal);
				}
			}
		}
	};

	useEffect(() => {
		if (total && charges) {
			if (splitType === 'total') {
				const { newCharges, split } = evenSplit(charges, total);

				if (deepEqual(charges, newCharges)) return;

				setValue('charges', newCharges);
				setValue('splitAmount', split);
			} else {
				if (splitAmount) {
					const newCharges = perPersonSplit(charges, splitAmount);

					if (deepEqual(charges, newCharges)) return;

					setValue('charges', newCharges);
					const newTotal = (parseInt(splitAmount) * Object.keys(newCharges).length).toString();
					setValue('total', newTotal);
				}
			}
		}
	}, [total, charges, setValue, splitType, splitAmount]);

	return (
		<>
			<Flex align="center" justify="between" className={clsx(styles.memberCard, styles.switcher)}>
				<Flex gap="3" align="center">
					<div
						className={styles.switch}
						onClick={() => {
							setType((prev) => {
								const next = prev === 'total' ? 'person' : 'total';
								bulkUpdateCharges(charges as any, total, next);
								return next;
							});
						}}
					>
						<ArrowsRightLeftIcon width="18px" />
					</div>
					<Text weight="medium" trim="both">
						{splitType === 'total' ? 'Total' : 'Per Person'}
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
				/>
			</Flex>
			{members
				?.filter((u) => Object.keys(charges || {})?.some((id) => parseInt(id) === u.id))
				?.map((user) => (
					<Flex key={user.id} align="center" justify="between" className={clsx(styles.memberCard)}>
						<Flex gap="3">
							<Avatar size="2" variant="soft" radius="full" fallback={getInitials(user.fullName)} />
							<div className={styles.header}>
								<Text weight="medium" size="2" trim="end">
									{user.fullName}
								</Text>
								<Text color="gray" size="1">
									{user.username}
								</Text>
							</div>
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
						/>
					</Flex>
				))}
		</>
	);
};

export default PhaseTwo;
