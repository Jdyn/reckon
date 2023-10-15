import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Container, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import { Avatar } from '@reckon/ui';
import { formatTimeAgo } from '~/utils/dates';

import styles from './BillCard.module.css';
import BillCharge from './BillCharge';

type BillCardProps = {
	bill: Bill;
	showCharges?: boolean;
	showGroup?: boolean;
};

const BillCard = ({ bill, showCharges, showGroup }: BillCardProps) => {
	return (
		<div className={styles.root}>
			<Avatar text={bill.creator.fullName} />
			<div className={styles.container}>
				{showGroup && <Heading size="2">{bill.group?.name}</Heading>}
				<Text className={styles.heading} size="2">
					{bill.creator.fullName} opened a ${bill.total.amount} bill
					{/* <div className={styles.status}>
						<ExclamationCircleIcon height="18px" />
						<Text size="2">{bill.status}</Text>
					</div> */}
				</Text>
				<Text className={styles.text} size="1">
					{formatTimeAgo(bill.inserted_at)}
				</Text>

				<Text size="3" my="3" mx="3">
					{bill.description}
				</Text>
				{/* <Heading size="2" mb="2">MEMBERS</Heading> */}
				<div className={styles.charges}>
					{showCharges &&
						bill.charges.map((charge) => <BillCharge charge={charge} key={charge.id} />)}
				</div>
			</div>
			<div className={styles.items}>
				{/* <Heading size="2">ITEMS</Heading> */}
				{bill.items.map((item) => (
					<div key={item.id} className={styles.item}>
						<Text size="2">{item.description}</Text>
						<Text color="ruby" size="2" weight="medium">
							+ ${item.cost.amount}
						</Text>
					</div>
				))}
				<Separator size="4" />
				<div className={styles.item}>
					<Text size="2" weight="bold">
						TOTAL
					</Text>
					<Text size="2" weight="medium">
						${bill.total.amount}
					</Text>
				</div>
			</div>
		</div>
	);
};

BillCard.defaultProps = {
	charges: false
};

export default BillCard;
