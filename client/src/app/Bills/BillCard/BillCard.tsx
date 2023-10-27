import {
	ChatBubbleOvalLeftIcon,
	EllipsisHorizontalIcon,
	HeartIcon
} from '@heroicons/react/24/outline';
import { CheckIcon, UploadIcon } from '@radix-ui/react-icons';
import { Badge, Button, Flex, Heading, HoverCard, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import { Avatar } from '@reckon/ui';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { formatTimeAgo } from '~/utils/dates';

import styles from './BillCard.module.css';

type BillCardProps = {
	bill: Bill;
};

const BillCard = ({ bill }: BillCardProps) => {
	const [_, setSearchParams] = useSearchParams();

	const updateQueryParam = () => {
		setSearchParams((prev) => {
			prev.set('bill', bill.id.toString());
			return prev;
		});
	};

	return (
		<div className={styles.timeRange} onClick={updateQueryParam}>
			<Flex direction="row" gap="3">
				<Avatar text={bill.creator.fullName} />
				<Flex direction="column" gap="3">
					<Flex className={styles.body} gap="4" direction="column">
						<Flex direction="column">
							<Text
								size="1"
								weight="medium"
								color="orange"
								trim="both"
								style={{ textTransform: 'uppercase' }}
							>
								{bill.status}
							</Text>
							<Text size="4">
								<Text weight="bold">{bill.creator.fullName}</Text> opened a{' '}
								{bill.total && `$${bill.total.amount}`} bill
							</Text>
							<Text color="gray" size="2">
								{formatTimeAgo(bill.inserted_at)}
							</Text>
						</Flex>
						{/* {bill.items && (
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
					)} */}
						<Text>{bill.description}</Text>
					</Flex>

					<Flex
						className={clsx(styles.event, styles.footer)}
						gap="4"
						align="center"
						px="2"
						pl="4"
						height="7"
					>
						<Button variant="ghost" color="gray">
							<HeartIcon width="18px" />
							<Text align="center" trim="both" weight="medium">
								2
							</Text>
						</Button>
						<Button variant="ghost" color="gray">
							<ChatBubbleOvalLeftIcon height="18px" />
							<Text align="center" trim="both" weight="medium">
								Discuss
							</Text>
						</Button>
						<Button variant="ghost" color="gray">
							<UploadIcon width="20px" />
							<Text align="center" trim="both" weight="medium">
								Share
							</Text>
						</Button>
						<Button variant="ghost" color="gray">
							<EllipsisHorizontalIcon width="15px" />
						</Button>
					</Flex>

					{bill.charges &&
						bill.charges.map((charge) => (
							<Flex key={charge.id} className={styles.event} gap="3" align="center">
								{/* <Avatar size="3" text={charge.user.fullName} /> */}
								<div className={styles.circle}>
									<CheckIcon width="20px" height="20px" />
								</div>
								<Flex direction="column" wrap="wrap">
									<Text>
										Waiting for
										<Text weight="bold"> {charge.user.fullName}</Text>
										<Text color="green"> to accept</Text>
									</Text>
								</Flex>
							</Flex>
						))}
				</Flex>
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
