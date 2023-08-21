import { User } from "../account/types";

export interface Group {
	id: string;
	name: string;
	creator: User;
	createdAt: string;
	updatedAt: string;
	members?: User[];
}
