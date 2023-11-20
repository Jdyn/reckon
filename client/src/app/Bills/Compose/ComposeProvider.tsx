import { ReactNode, createContext, useContext, useState } from 'react';

type BillForm = {
	description?: string;
	type?: string;
	group_id?: number;
	charges?: {
		[id: string]: {
			amount: string;
			user_id: number;
		};
	};
	total?: string;
	splitAmount?: string;
	phase: number;
};

export type ComposeItemType = Partial<BillForm> & { phase: number };
export type ComposeState = Record<string, ComposeItemType>;

type ComposeContextType = {
	compose: {
		state: ComposeState;
		update: (key: string, form: ComposeItemType) => void;
		create: (newKey: string) => void;
		delete: (key: string) => void;
		show: (key: string) => ComposeItemType;
	};
};

const ComposeContext = createContext<ComposeContextType | undefined>(undefined);

export const ComposeProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useState<ComposeState>(() => {
		const storedCompose = localStorage.getItem('compose');
		return storedCompose ? (JSON.parse(storedCompose) as ComposeState) : {};
	});

	const updateCompose = (key: string, form: ComposeItemType) => {
		setState((prev) => {
			const newCompose = { ...prev, [key]: form } as ComposeState;
			localStorage.setItem('compose', JSON.stringify(newCompose));
			return newCompose;
		});
	};

	const newCompose = (newKey: string) => {
		setState((prev) => {
			const newCompose = { ...prev, [newKey]: {} } as ComposeState;
			localStorage.setItem('compose', JSON.stringify(newCompose));
			return newCompose;
		});
	};

	const deleteCompose = (key: string) => {
		setState((prev) => {
			const newCompose = { ...prev };
			delete newCompose[key];
			localStorage.setItem('compose', JSON.stringify(newCompose));
			return newCompose;
		});
	};

	const show = (key: string): ComposeItemType => {
		if (key in state) {
			return state[key] as ComposeItemType;
		}

		return { phase: 0 };
	};

	return (
		<ComposeContext.Provider
			value={{
				compose: {
					state: state,
					create: newCompose,
					update: updateCompose,
					delete: deleteCompose,
					show
				}
			}}
		>
			{children}
		</ComposeContext.Provider>
	);
};

export const useCompose = () => {
	const context = useContext(ComposeContext);
	if (!context) {
		throw new Error('useCompose must be used within a ComposeProvider');
	}
	return context;
};
