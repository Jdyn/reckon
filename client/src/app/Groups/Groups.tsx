import { useGroupBillsQuery } from '@reckon/core';
import { useParams } from 'react-router';
import BillCard from '~/app/Bills/BillCard';

import styles from './Group.module.css';

const Group = () => {
	const { id } = useParams<{ id: string }>();
	const { data } = useGroupBillsQuery(id!, { skip: !id });
	return (
		<div className={styles.root}>
			{data && data.bills.map((bill) => <BillCard key={bill.id} bill={bill} />)}
		</div>
	);
};

export default Group;
