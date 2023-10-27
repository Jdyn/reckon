import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import { useGetBillQuery } from '@reckon/core';
import { Avatar } from '@reckon/ui';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatTimeAgo } from '~/utils/dates';

const BillView = () => {
	const [params, setSearchParams] = useSearchParams();

	const billId = useMemo(() => params.get('bill') || undefined, [params]);

	const { data: bill } = useGetBillQuery(billId, { skip: !billId });

	return (
		<Flex width="100%" direction="column" style={{ overflow: 'hidden' }}>
			<Flex justify="end" py="2" px="5">
				<Button
					variant="ghost"
					color="gray"
					onClick={() => {
						setSearchParams((prev) => {
							prev.delete('bill');
							return prev;
						});
					}}
				>
					<XMarkIcon width="18px" />
				</Button>
			</Flex>
			{bill && (
				<ScrollArea>
					<Flex  direction="column" gap="4" px="4">
						<Flex direction="row" gap="3" justify="between">
							<Flex direction="column">
								<Heading size="2">{bill.group?.name}</Heading>
								<Text size="4">
									<Text weight="bold">{bill.creator.username}</Text> opened a{' '}
									{bill.total && `$${bill.total.amount}`} bill
								</Text>
								<Text color="gray" size="2">
									{formatTimeAgo(bill.inserted_at)}
								</Text>
							</Flex>
						</Flex>
						<Flex direction="column" gap="4">
							<Text weight="bold" size="2">
								DESCRIPTION
							</Text>
							<Text mx="3">{bill.description}</Text>
						</Flex>
						<Flex direction="column" gap="4">
							<Text weight="bold" size="2">
								ITEMS
							</Text>
							<Flex direction="column" gap="3">
								{bill.items?.map((item) => (
									<Flex gap="2" key={item.id} px="3" justify="between">
										<Text>{item.description}</Text>
										<Text color="green">${item.cost.amount}</Text>
									</Flex>
								))}
							</Flex>
							<Separator size="4" />
							<Flex gap="2" px="3" justify="between">
								<Text weight="medium" size="2">
									TOTAL
								</Text>
								<Text weight="medium" size="2">
									${bill.total?.amount}
								</Text>
							</Flex>
						</Flex>
						<Flex direction="column" gap="4">
							<Text weight="bold" size="2">
								CHARGES
							</Text>
							<Flex direction="column" gap="3">
								{bill.charges?.map((charge) => (
									<Flex key={charge.id} gap="3" align="center" justify="between">
										<Flex direction="row" wrap="wrap" gap="3" align="center">
											<Avatar size="3" text={charge.user.fullName} />
											<Text weight="bold">{charge.user.username}</Text>
										</Flex>
										<Text color="red">{`$${charge.amount.amount}`}</Text>
									</Flex>
								))}
							</Flex>
						</Flex>
					</Flex>
				</ScrollArea>
			)}
		</Flex>
	);
};

export default BillView;
