import { User } from "../account";

export type Money = {
	amount: string;
	currency: string;
}

export type Bill = {
	id: number;
	description: string;
	total: Money;
	group_id?: string;
	inserted_at: string;
	items: BillItem[];
	charges: BillCharge[];
	creator: User;
}

export type BillItem = {
	id: number;
	description: string;
	cost: Money;
	note?: string;
}

export type BillCharge = {
	id: number;
	user_id: number;
	amount: Money;
	payment_status: string;
	approved: boolean;
}
