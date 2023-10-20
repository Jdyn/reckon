import { Flex } from '@radix-ui/themes';
import { useUserBillsQuery } from '@reckon/core';

import BillCard from '../Bills/BillCard';
import styles from './Home.module.css';

const Home = () => {
	const { data: bills } = useUserBillsQuery();

	return (
		<Flex direction="column" gap="2" p="3" align="center">
			{bills &&
				bills.map((bill) => (
					<BillCard key={bill.id} bill={bill} showGroup />
				))}
		</Flex>
	);
};

export default Home;
