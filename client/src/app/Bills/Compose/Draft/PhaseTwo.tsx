import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import { useMemberListQuery } from '@reckon/core';
import { getInitials } from '@reckon/ui';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { NumberInput } from '~/components/NumberInput';

import styles from '../Compose.module.css';
import { BillForm } from '../ComposeItem';

interface PhaseOneProps {
	setPhase: React.Dispatch<React.SetStateAction<number>>;
}

// const objectsEqual = (o1: Record<string, any>, o2: Record<string, any>): boolean =>
// 	typeof o1 === 'object' && Object.keys(o1).length > 0
// 		? Object.keys(o1).length === Object.keys(o2).length &&
// 		  Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
// 		: o1 === o2;

// const arraysEqual = (a1: Record<string, any>[], a2: Record<string, any>[]): boolean =>
// 	a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx] as any));

function deepEqual(obj1: any, obj2: any): boolean {
	if (obj1 === obj2) {
		return true;
	}

	if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
		return false;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
}

const PhaseOne = ({ setPhase }: PhaseOneProps) => {
	const { watch, setValue } = useFormContext<BillForm>();
	const [group_id, charges, total] = watch(['group_id', 'charges', 'total']);
	const { data: members } = useMemberListQuery(group_id!, { skip: !group_id });

	useEffect(() => {
		if (total && charges) {
			const newCharges = { ...charges };

			const count = Object.keys(newCharges).length;

			for (const key in newCharges) {
				// rounded_money = Money.round(money)

				// div =
				// 	rounded_money
				// 	|> Money.div!(parts)
				// 	|> round

				// remainder = sub!(money, mult!(div, parts))
				const roundedTotal = Math.round(total * 100);
				console.log(total)

				// newCharges[key] = { ...newCharges[key], amount: parseFloat(`${total / count}`).toFixed(2) };
			}

			// if (deepEqual(charges, newCharges)) return;
			// console.log(newCharges, newCharges);
			// setValue('charges', newCharges);
		}
	}, [total, charges, setValue]);

	return (
		<>
			<Flex align="center" justify="between" className={clsx(styles.memberCard)}>
				<Flex gap="3">
					<div className={styles.switch}>
						<ArrowsRightLeftIcon width="18px" />
					</div>
					<Flex align="center">
						<Text weight="medium" size="2">
							Total
						</Text>
					</Flex>
				</Flex>
				<NumberInput
					name="total"
					min={0}
					formatOptions={{
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}}
					allowMouseWheel
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
								style: 'currency',
								currency: 'USD',
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}}
							allowMouseWheel
						/>
					</Flex>
				))}
		</>
	);
};

export default PhaseOne;
