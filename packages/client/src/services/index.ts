export interface ApiErrorResponse {
	ok: boolean;
	error?: string;
	errors?: Record<string, string>;
}

export interface ApiResponse {
	ok: boolean;
	result: unknown;
}

export * from './account';
