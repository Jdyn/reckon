import { User } from "../account/types";

export interface Group {
	id: number;
	name: string;
	creator: User;
	createdAt: string;
	updatedAt: string;
	members?: User[];
}

export interface GroupInvite {
	group: Group;
	sender: User;
	recipient: User;
	createdAt: string;
	id: string;
}

export type GroupInvitePayload = {
	groupId: string;
	body: {
		recipient: {
			identifier: string;
		}
	}
}
