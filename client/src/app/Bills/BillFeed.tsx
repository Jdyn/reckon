import { BillListType, useBillListQuery } from '@reckon/core';
import BillList from './BillList';
import { useParams } from 'react-router-dom';

interface BillFeedProps {
	type: BillListType;
}

const BillFeed = ({ type }: BillFeedProps) => {
	const { id } = useParams<{ id: string }>();
	const { data: bills } = useBillListQuery({ groupId: id, type});

	return (
		<BillList bills={bills} />
	);
};

export default BillFeed;
