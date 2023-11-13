import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import { useMemberListQuery } from '@reckon/core';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getInitials } from '~/components/Avatar';
import { NumberInput } from '~/components/NumberInput';

import styles from '../Compose.module.css';
import { BillForm } from '../ComposeItem';
import { deepEqual, evenSplit, perPersonSplit } from '../service';

interface PhaseOneProps {
	setPhase: React.Dispatch<React.SetStateAction<number>>;
}

const PhaseOne = ({ setPhase }: PhaseOneProps) => {
	const [splitType, setType] = useState<'total' | 'person'>('total');
	const { watch, setValue } = useFormContext<BillForm>();
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
			<div className={clsx(styles.switcher)}>
				<Flex direction="column" style={{ opacity: splitType === 'person' ? '0.3' : 1 }}>
					<Text weight="medium">Total</Text>
					<NumberInput
						name="total"
						min={0}
						formatOptions={{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}}
						allowMouseWheel
					/>
				</Flex>

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

				<Flex direction="column" style={{ opacity: splitType === 'total' ? '0.3' : 1 }}>
					<Text weight="medium">Per person</Text>
					<NumberInput
						name="splitAmount"
						min={0}
						formatOptions={{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}}
						allowMouseWheel
						disabled={splitType === 'total'}
					/>
				</Flex>
			</div>
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

export default PhaseOne;
