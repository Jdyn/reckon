import React, { ReactNode, createContext, useContext, useState } from 'react';

import { BillForm } from './ComposeItem';

type ComposeState = {
	[key: string]: Partial<BillForm>;
};

type ComposeContextType = {
	composeState: ComposeState;
	updateCompose: (key: string, form: Partial<BillForm>) => void;
	newCompose: (newKey: string) => void;
	deleteCompose: (key: string) => void;
};

const ComposeContext = createContext<ComposeContextType | undefined>(undefined);

export const ComposeProvider = ({ children }: { children: ReactNode }) => {
	const [composeState, setCompose] = useState<ComposeState>(() => {
		const storedCompose = localStorage.getItem('compose');
		return storedCompose ? (JSON.parse(storedCompose) as ComposeState) : {};
	});

	const updateCompose = (key: string, form: Partial<BillForm>) => {
		setCompose((prev) => {
			const newCompose = { ...prev, [key]: form };
			localStorage.setItem('compose', JSON.stringify(newCompose));
			return newCompose;
		});
	};

	const newCompose = (newKey: string) => {
		setCompose((prev) => {
			const newCompose = { ...prev, [newKey]: {} };
			localStorage.setItem('compose', JSON.stringify(newCompose));
			return newCompose;
		});
	};

	const deleteCompose = (key: string) => {
		setCompose((prev) => {
			const newCompose = { ...prev };
			delete newCompose[key];
			localStorage.setItem('compose', JSON.stringify(newCompose));
			return newCompose;
		});
	};

	return (
		<ComposeContext.Provider value={{ composeState, updateCompose, newCompose, deleteCompose }}>
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
