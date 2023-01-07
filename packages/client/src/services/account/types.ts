export interface User {
	id: number;
	firstName: string;
	email: string;
	confirmedAt: string;
	isAdmin: boolean;
}

export interface Session {
	context: 'session';
	insertedAt: string;
	token: string;
	trackingId: string;
}
