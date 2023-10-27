import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, ScrollArea, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import useDimensions from 'react-cool-dimensions';
import BillCard from '~/app/Bills/BillCard';

import styles from './Bills.module.css';

interface BillListProps {
	bills?: Bill[];
}

const BillList = ({ bills }: BillListProps) => {
	const { observe, height } = useDimensions();

	return (
		<div className={styles.bills} ref={observe}>
			<ScrollArea style={{ height }}>
				<Flex direction="column" m="2" mb="0">
					<Flex gap="2" align="center" pb="4">
						<div className={styles.circle}>
							<CalendarDaysIcon width="21px" />
						</div>
						<Flex direction="column">
							<Heading>This week</Heading>
							<Text color="gray">View bills opened this week.</Text>
						</Flex>
					</Flex>

					{bills && bills.map((bill) => <BillCard key={bill.id} bill={bill} />)}

					<Flex gap="2" align="center" pb="4">
						<div className={styles.circle}>
							<CalendarDaysIcon width="21px" />
						</div>
						<Flex direction="column">
							<Heading>Last week</Heading>
							<Text color="gray">View bills opened last week.</Text>
						</Flex>
					</Flex>

					{bills && bills.map((bill) => <BillCard key={bill.id} bill={bill} />)}
				</Flex>
			</ScrollArea>
		</div>
	);
};

export default BillList;
