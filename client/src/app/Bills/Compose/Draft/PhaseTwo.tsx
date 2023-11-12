import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import { useMemberListQuery } from '@reckon/core';
import { getInitials } from '@reckon/ui';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { NumberInput } from '~/components/NumberInput';

import styles from '../Compose.module.css';
import { BillForm } from '../ComposeItem';
import { deepEqual, evenSplit } from '../service';

interface PhaseOneProps {
	setPhase: React.Dispatch<React.SetStateAction<number>>;
}

const PhaseOne = ({ setPhase }: PhaseOneProps) => {
	const [splitType, setType] = useState<'total' | 'individual'>('total');
	const { watch, setValue } = useFormContext<BillForm>();
	const [group_id, charges, total] = watch(['group_id', 'charges', 'total']);
	const { data: members } = useMemberListQuery(group_id!, { skip: !group_id });

	useEffect(() => {
		if (total && charges) {
			const newCharges = evenSplit(charges, total);

			if (deepEqual(charges, newCharges)) return;

			setValue('charges', newCharges);
		}
	}, [total, charges, setValue]);

	return (
		<>
			<div className={clsx(styles.switcher)}>
				<Flex direction="column" style={{ opacity: splitType === 'individual' ? '0.3' : 1 }}>
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
					onClick={() => setType((prev) => (prev === 'total' ? 'individual' : 'total'))}
				>
					<ArrowsRightLeftIcon width="18px" />
				</div>

				<Flex direction="column" style={{ opacity: splitType === 'total' ? '0.3' : 1 }}>
					<Text weight="medium">Per person</Text>
					<NumberInput
						name="total"
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
