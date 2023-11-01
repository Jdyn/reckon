import { User } from "../account/types";
import { BillCategory } from "../bill";

export interface Group {
	id: number;
	name: string;
	creator: User;
	createdAt: string;
	updatedAt: string;
	members?: User[];
	bill_categories?: BillCategory[];
}

export interface GroupInvite {
	group: Group;
	sender: User;
	recipient: User;
	createdAt: string;
	id: string;
}

export type GroupInvitePayload = {
	groupId: number;
	body: {
		recipient: {
			identifier: string;
		}
	}
}
