import { ReactNode, createContext, useContext, useState } from 'react';

import { BillForm } from './ComposeItem';

type ComposeState = {
	[key: string]: Partial<BillForm>;
};

type ComposeContextType = {
	compose: {
		state: ComposeState;
		update: (key: string, form: Partial<BillForm>) => void;
		create: (newKey: string) => void;
		delete: (key: string) => void;
		show: (key: string) => Partial<BillForm>;
	};
};

const ComposeContext = createContext<ComposeContextType | undefined>(undefined);

export const ComposeProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useState<ComposeState>(() => {
		const storedCompose = localStorage.getItem('compose');
		return storedCompose ? (JSON.parse(storedCompose) as ComposeState) : {};
	});

	const updateCompose = (key: string, form: Partial<BillForm>) => {
		setState((prev) => {
			const newCompose = { ...prev, [key]: form };
			localStorage.setItem('compose', JSON.stringify(newCompose));
			return newCompose;
		});
	};

	const newCompose = (newKey: string) => {
		setState((prev) => {
			const newCompose = { ...prev, [newKey]: {} };
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

	const show = (key: string): Partial<BillForm> => {
		if (key in state) {
			return state[key] as Partial<BillForm>;
		}

		return {};
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
