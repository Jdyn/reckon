import { Badge, Flex, Heading, HoverCard, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import { Avatar } from '@reckon/ui';
import { formatTimeAgo } from '~/utils/dates';

import styles from './BillCard.module.css';

type BillCardProps = {
	bill: Bill;
};

const BillCard = ({ bill }: BillCardProps) => {
	return (
		<div className={styles.timeRange}>
			<Flex direction="column" gap="3">
				<Flex direction="row" gap="3">
					<Avatar text={bill.creator.fullName} />
					<Flex direction="column">
						{/* <Heading size="2">{bill.group?.name}</Heading> */}

						<Text size="4">
							<Text weight="bold">{bill.creator.username}</Text> opened a{' '}
							{bill.total && `$${bill.total.amount}`} bill
						</Text>
						<Text color="gray" size="2">
							{formatTimeAgo(bill.inserted_at)}
						</Text>
					</Flex>
				</Flex>

				<Flex className={styles.body} gap="4" direction="column">
					{bill.items && (
						<Flex gap="2">
							{bill.items.map((item) => (
								<HoverCard.Root key={item.id} openDelay={1} closeDelay={0}>
									<HoverCard.Trigger>
										<Badge radius="full" size="1">
											{item.description} ${item.cost.amount}
										</Badge>
									</HoverCard.Trigger>
									{item.note && (
										<HoverCard.Content>
											<Text>{item.note}</Text>
										</HoverCard.Content>
									)}
								</HoverCard.Root>
							))}
						</Flex>
					)}
					<Text>{bill.description}</Text>
				</Flex>

				{bill.charges &&
					bill.charges.map((charge) => (
						<Flex key={charge.id} className={styles.event} gap="3" align="center">
							<Avatar size="3" text={charge.user.fullName} />
							<Flex direction="column" wrap="wrap">
								<Text>
									<Text weight="bold">{charge.user.username}</Text> pays{' '}
									<Text color="green">{`$${charge.amount.amount}`}</Text>
								</Text>
								{/* <Text>•</Text> */}
							</Flex>
						</Flex>
					))}
			</Flex>
		</div>
	);
};

BillCard.defaultProps = {
	charges: false
};

export default BillCard;

{
	/* <Avatar text={bill.creator.fullName} />
<div className={styles.container}>
	{showGroup && <Heading size="2">{bill.group?.name}</Heading>}
	<Text className={styles.heading} size="2">
		{bill.creator.fullName} opened a ${bill.total.amount} bill
	</Text>
	<Text className={styles.text} size="1">
		{formatTimeAgo(bill.inserted_at)}
	</Text> */
}

// 	<Text size="3" my="3" mx="3">
// {bill.description}
// 	</Text>
// 	{/* <Heading size="2" mb="2">MEMBERS</Heading> */}
// <div className={styles.charges}>
// 	{showCharges &&
// 		bill.charges.map((charge) => <BillCharge charge={charge} key={charge.id} />)}
// </div>
// </div>
// <div className={styles.items}>
// 	{/* <Heading size="2">ITEMS</Heading> */}
// 	{bill.items.map((item) => (
// 		<div key={item.id} className={styles.item}>
// 			<Text size="2">{item.description}</Text>
// 			<Text color="ruby" size="2" weight="medium">
// 				+ ${item.cost.amount}
// 			</Text>
// 		</div>
// 	))}
// 	<Separator size="4" />
// 	<div className={styles.item}>
// 		<Text size="2" weight="bold">
// 			TOTAL
// 		</Text>
// 		<Text size="2" weight="medium">
// 			${bill.total.amount}
// 		</Text>
// 	</div>
// </div>
