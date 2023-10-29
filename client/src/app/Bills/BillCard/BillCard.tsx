import {
	ChatBubbleOvalLeftIcon,
	EllipsisHorizontalIcon,
	HeartIcon
} from '@heroicons/react/24/outline';
import { CheckIcon, UploadIcon } from '@radix-ui/react-icons';
import { Badge, Button, Flex, Heading, HoverCard, Text } from '@radix-ui/themes';
import {
	Bill,
	BillCharge,
	useAccountQuery,
	useLikeBillMutation,
	useUpdateChargeMutation
} from '@reckon/core';
import { Avatar } from '@reckon/ui';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatTimeAgo } from '~/utils/dates';

import styles from './BillCard.module.css';

type BillCardProps = {
	bill: Bill;
};

const BillCard = ({ bill }: BillCardProps) => {
	const [_, setSearchParams] = useSearchParams();
	const [updateCharge] = useUpdateChargeMutation();
	const { data: user } = useAccountQuery();
	const [likeBill] = useLikeBillMutation();
	const currentCharge = useMemo(() => {
		return bill.charges?.find((charge) => charge.user.id === user?.id);
	}, [bill, user]);

	const updateQueryParam = () => {
		setSearchParams((prev) => {
			prev.set('bill', bill.id.toString());
			return prev;
		});
	};

	const handleChargeUpdate = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		body: Partial<BillCharge>
	) => {
		e.stopPropagation();
		currentCharge &&
			updateCharge({
				chargeId: currentCharge.id,
				body,
				bill
			});
	};

	return (
		<div className={styles.timeRange} onClick={updateQueryParam}>
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
					{(currentCharge?.approval_status === 'declined' ||
						currentCharge?.approval_status === 'approved') && (
						<Button
							size="1"
							variant="soft"
							color="gray"
							onClick={(e) => {
								handleChargeUpdate(e, { approval_status: 'pending' });
							}}
						>
							<CheckIcon height="18px" />
							<Text align="center" trim="both" weight="medium">
								{currentCharge?.approval_status === 'approved' ? 'unaccept' : 'Undecline'}
							</Text>
						</Button>
					)}
					{currentCharge?.approval_status === 'pending' && (
						<>
							<Button
								size="1"
								variant="soft"
								color="jade"
								onClick={(e) => handleChargeUpdate(e, { approval_status: 'approved' })}
							>
								<CheckIcon height="18px" />
								<Text align="center" trim="both" weight="medium">
									Accept
								</Text>
							</Button>
							<Button
								size="1"
								variant="soft"
								color="crimson"
								onClick={(e) => handleChargeUpdate(e, { approval_status: 'declined' })}
							>
								<CheckIcon height="18px" />
								<Text align="center" trim="both" weight="medium">
									Decline
								</Text>
							</Button>
						</>
					)}

					<Button
						variant="ghost"
						color={bill.liked ? 'crimson' : 'gray'}
						onClick={(e) => {
							e.stopPropagation();
							likeBill({ billId: bill.id, meta: { groupId: bill.group_id } })
						}}
					>
						<HeartIcon width="18px" />
						<Text align="center" trim="both" weight="medium">
							{bill.like_count}
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
							<div
								className={clsx(
									styles.circle,
									charge.approval_status === 'approved' && styles.approved,
									charge.approval_status === 'declined' && styles.declined,
									charge.approval_status === 'pending' && styles.pending
								)}
							>
								<CheckIcon width="20px" height="20px" />
							</div>
							<Flex direction="column" wrap="wrap">
								{charge.approval_status === 'pending' && (
									<Flex direction="column" gap="2">
										<Text size="3">
											<Text weight="medium">
												{charge.user.id === user?.id ? 'You have' : `${charge.user.fullName} has`}{' '}
											</Text>
											not responded.
										</Text>
									</Flex>
								)}
								{charge.approval_status === 'approved' && (
									<Text size="3">
										<Text weight="medium">
											{charge.user.id === user?.id ? 'You have' : `${charge.user.fullName} has`}{' '}
										</Text>
										accepted.
									</Text>
								)}
								{charge.approval_status === 'declined' && (
									<Text size="3">
										<Text weight="medium">
											{charge.user.id === user?.id ? 'You have' : `${charge.user.fullName} has`}{' '}
										</Text>{' '}
										declined.
									</Text>
								)}
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
