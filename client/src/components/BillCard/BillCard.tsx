import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import { Avatar } from '@reckon/ui';
import { formatTimeAgo } from '~/util/dates';

import styles from './BillCard.module.css';

type BillCardProps = {
	bill: Bill;
};

const BillCard = ({ bill }: BillCardProps) => {
	return (
		<div className={styles.root}>
			<Avatar text={bill.creator.fullName} />
			<div className={styles.container}>
				<Text className={styles.heading} size="3">
					{bill.creator.fullName} started a bill
					<div className={styles.status}>
						<ExclamationCircleIcon height="24px" />
						<Text>{bill.status}</Text>
					</div>
				</Text>
				<Text className={styles.text} size="2">
					{formatTimeAgo(bill.inserted_at)}
				</Text>

				<Heading size="5" my="4">
					{bill.description}
				</Heading>
				{/* <div className={styles.items}>
					<Heading size="3">ITEMS</Heading>
					{bill.items.map((item) => (
						<div key={item.id} className={styles.item}>
							<Text size="2">{item.description}</Text>
							<Text className={styles.cost} size="2" weight="medium">
								+ ${item.cost.amount}
							</Text>
						</div>
					))}
				</div> */}
				<div className={styles.items}>
					<Heading size="3">MEMBERS</Heading>
					{bill.charges.map((charge) => (
						<div key={charge.id} className={styles.item}>
							<Flex gap="3" align="center">
								<Avatar text={charge.user.fullName} />
								<Text size="2">{charge.user.fullName}</Text>
							</Flex>
							<Text className={styles.amount} size="2" weight="medium">
								- ${charge.amount.amount}
							</Text>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BillCard;
