import { Bill, useGlobalBillsQuery, useGroupBillsQuery, useUserBillsQuery } from '@reckon/core';
import BillList from './BillList';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

interface BillFeedProps {
	type: 'user' | 'group' | 'global';
}

const BillFeed = ({ type }: BillFeedProps) => {
	const { id } = useParams<{ id: string }>();
	const { data: global } = useGlobalBillsQuery(undefined, { skip: type !== 'global' });
	const { data: user } = useUserBillsQuery(undefined, { skip: type !== 'user' });
	const { data: group } = useGroupBillsQuery(id!, { skip: !id });

	const bills: Bill[] = useMemo(() => {
		switch (type) {
			case 'user':
				return user || [];
			case 'group':
				return group || [];
			case 'global':
				return global || [];
		}
	}, [type, user, group, global])

	return (
		<BillList bills={bills} />
	);
};

export default BillFeed;
