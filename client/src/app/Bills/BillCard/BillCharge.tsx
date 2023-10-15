import { Flex, HoverCard, Text, Tooltip } from '@radix-ui/themes';
import { BillCharge } from '@reckon/core';
import { Avatar } from '@reckon/ui';

import styles from './BillCard.module.css';

interface BillChargeProps {
	charge: BillCharge;
}

// content={``}

const BillChargeCard = ({ charge }: BillChargeProps) => {
	return (
		<HoverCard.Root>
			<HoverCard.Trigger>
				<div key={charge.id} className={styles.charge}>
					<Avatar height="32px" width="32px" text={charge.user.fullName} />
					<Text color="grass" size="2" weight="medium">
						${charge.amount.amount}
					</Text>
				</div>
			</HoverCard.Trigger>

			<HoverCard.Content>
				{`${charge.user.fullName} is paying $${charge.amount.amount}`}
			</HoverCard.Content>
		</HoverCard.Root>
	);
};

export default BillChargeCard;
