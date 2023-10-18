import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import {
	Container,
	Flex,
	Heading,
	IconButton,
	ScrollArea,
	Separator,
	Text
} from '@radix-ui/themes';
import { useGroupBillsQuery } from '@reckon/core';
import { useParams } from 'react-router';
import BillCard from '~/app/Bills/BillCard';

import styles from './Group.module.css';

const Group = () => {

	const { id } = useParams<{ id: string }>();
	const { data: bills } = useGroupBillsQuery(id!, { skip: !id });
	return (
		<Container size="2" className={styles.bills}>
			{/* <ScrollArea type="hover"> */}
				<Flex gap="2" align="center" pb="4">
					<div className={styles.circle}>
						<CalendarDaysIcon width="21px" />
					</div>
					<Text color="gray">This week</Text>
				</Flex>
				{bills && bills.map((bill) => <BillCard key={bill.id} bill={bill} showCharges />)}
				<Flex gap="2" align="center" pb="4">
					<div className={styles.circle}>
						<CalendarDaysIcon width="21px" />
					</div>
					<Text color="gray">Last week</Text>
				</Flex>
				{bills && bills.map((bill) => <BillCard key={bill.id} bill={bill} showCharges />)}
			{/* </ScrollArea> */}
		</Container>
	);
};

export default Group;
