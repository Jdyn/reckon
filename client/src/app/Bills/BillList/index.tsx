import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, ScrollArea, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import useDimensions from 'react-cool-dimensions';
import BillCard from '~/app/Bills/BillCard';

import styles from './Bills.module.css';
import { useMemo } from 'react';

interface BillListProps {
	bills?: Bill[];
}

const BillList = ({ bills }: BillListProps) => {
	const { observe, height } = useDimensions();

	const [thisWeek, upcoming] = useMemo(() => {
		const newEvents: any[] = [];
		const newUpcoming: any[] = [];
		const now = new Date();

		if (bills) {
			bills.forEach((obj) => {
				const startDate = new Date(obj.inserted_at);
				const timeDiff = startDate.getTime() - now.getTime();
				const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

				if (daysDiff <= 7) {
					newEvents.push(obj);
				} else {
					newUpcoming.push(obj);
				}
			});
		}

		return [newEvents, newUpcoming];
	}, [bills]);

	return (
		<div className={styles.bills} ref={observe}>
			<ScrollArea style={{ height }}>
				<Flex direction="column" m="5" mb="0">
					<Flex gap="2" align="center" pb="4">
						<div className={styles.circle}>
							<CalendarDaysIcon width="21px" />
						</div>
						<Flex direction="column">
							<Heading>This week</Heading>
							<Text color="gray">View bills opened this week.</Text>
						</Flex>
					</Flex>

					{thisWeek && thisWeek.map((bill) => <BillCard key={bill.id} bill={bill} />)}

					<Flex gap="2" align="center" pb="4">
						<div className={styles.circle}>
							<CalendarDaysIcon width="21px" />
						</div>
						<Flex direction="column">
							<Heading>Last week</Heading>
							<Text color="gray">View bills opened last week.</Text>
						</Flex>
					</Flex>

					{upcoming && upcoming.map((bill) => <BillCard key={bill.id} bill={bill} />)}
				</Flex>
			</ScrollArea>
		</div>
	);
};

export default BillList;
