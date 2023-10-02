import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import { Avatar } from '@reckon/ui';
import { formatTimeAgo } from '~/utils/dates';

import styles from './BillCard.module.css';

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
					{bill.creator.fullName} started a bill
					<div className={styles.status}>
						<ExclamationCircleIcon height="18px" />
						<Text size="2">{bill.status}</Text>
					</div>
				</Text>
				<Text className={styles.text} size="1">
					{formatTimeAgo(bill.inserted_at)}
				</Text>

				<Text size="3" my="3">
					{bill.description}
				</Text>
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
					{/* <Heading size="3">People</Heading> */}
					{showCharges &&
						bill.charges.map((charge) => (
							<div key={charge.id} className={styles.item}>
								<Flex gap="3" align="center">
									<Avatar height="32px" width="32px" text={charge.user.fullName} />
									<Text size="2">{charge.user.fullName}</Text>
								</Flex>
								<Text className={styles.cost} size="2" weight="medium">
									+ ${charge.amount.amount}
								</Text>
							</div>
						))}
				</div>
				{/* <div className={styles.item}>
					<Text size="3">Total</Text>
					<Text size="2" weight="medium">
						${bill.total.amount}
					</Text>
				</div> */}
			</div>
		</div>
	);
};

BillCard.defaultProps = {
	charges: false
};

export default BillCard;
