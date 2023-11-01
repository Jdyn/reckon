import { User } from '../account';
import { Group } from '../group';

export type Money = {
	amount: string;
	currency: string;
};

export type BillType = 'split' | 'pool';

export type Bill = {
	id: number;
	description: string;
	type: BillType;
	total?: Money;
	group_id?: number;
	category_id: number;
	inserted_at: string;
	items?: BillItem[];
	charges?: BillCharge[];
	creator: User;
	status?: string;
	group?: Group;
	like_count: number;
	liked?: boolean;
};

export type BillItem = {
	id: number;
	description: string;
	cost: Money;
	note?: string;
};

export type ApprovalStatus = 'approved' | 'declined' | 'pending';

export type BillCategory = {
	id: number;
	name: string;
	color?: string;
	group_id: number;
};

export type BillCharge = {
	id: number;
	user_id: number;
	amount: Money;
	payment_status: string;
	approval_status: ApprovalStatus;
	user: User;
};
