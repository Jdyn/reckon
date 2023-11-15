import {
	ChatBubbleOvalLeftIcon,
	EllipsisHorizontalIcon,
	HeartIcon
} from '@heroicons/react/24/outline';
import { CheckIcon, UploadIcon } from '@radix-ui/react-icons';
import { Button, Flex, Text } from '@radix-ui/themes';
import {
	Bill,
	BillCharge,
	useLikeBillMutation,
	useSessionQuery,
	useUpdateChargeMutation
} from '@reckon/core';
import Avatar from '~/components/Avatar';
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
	const { data: session } = useSessionQuery();
	const [likeBill] = useLikeBillMutation();

	const currentCharge = useMemo(() => {
		return bill.charges?.find((charge) => charge.user.id === session?.user?.id);
	}, [bill, session]);

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
			<Avatar variant="soft" radius="full" text={bill.creator.fullName} />
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
						<Text color="gray" size="3">
							{formatTimeAgo(bill.inserted_at)}
						</Text>
					</Flex>
					<Text>{bill.description}</Text>
				</Flex>

				<Flex
					className={clsx(styles.event, styles.footer)}
					gap="4"
					align="center"
					wrap="wrap"
					px="2"
					pl="4"
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
							likeBill({ billId: bill.id, meta: { groupId: bill.group_id } });
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
							{/* <Avatar size="2" text={charge.user.fullName} /> */}
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
							<Flex direction="row" gap="1" align="start">
								<Text size="3" align="center">
									{charge.user.id === session?.user.id ? 'You pay' : `${charge.user.fullName} pays`}{' '}
									<Text>${charge.amount.amount}</Text>
								</Text>
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
