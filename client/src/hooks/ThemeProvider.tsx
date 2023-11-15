import { Theme } from '@radix-ui/themes';
import { ThemePanel } from '@radix-ui/themes';
import { ThemeProps } from '@radix-ui/themes/dist/cjs/theme';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useDimensions from 'react-cool-dimensions';
import useMeasure from 'react-use-measure';

type ThemeKey = 'light' | 'dark' | 'system';

export const ThemeProviderContext = createContext<{
	theme: ThemeKey;
	setTheme: (theme: ThemeKey) => void;
}>({
	theme: 'system',
	setTheme: () => {}
});

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme: ThemeKey;
	storageKey: string;
}

export function ThemeProvider(props: ThemeProviderProps) {
	const { children, defaultTheme, storageKey } = props;

	const [theme, _setTheme] = useState<ThemeKey>(
		() => (localStorage.getItem(storageKey) as ThemeKey) || defaultTheme
	);

	const { observe } = useDimensions({
		breakpoints: {
			'90%': 0,
			'95%': 1300,
			'100%': 1500,
			'105%': 1850,
			'110%': 2150
		},
		updateOnBreakpointChange: true,
		onResize: ({ width, height, currentBreakpoint }) => {
			setScale(currentBreakpoint as ThemeProps['scaling']);
			localStorage.setItem('scale', currentBreakpoint);
		}
	});

	const [scale, setScale] = useState<ThemeProps['scaling']>(
		(localStorage.getItem('scale') as ThemeProps['scaling']) || '100%'
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add('dark');
	}, [theme]);

	const setTheme = useCallback(
		(theme: ThemeKey) => {
			localStorage.setItem(storageKey, theme);
			_setTheme(theme);
		},
		[_setTheme, storageKey]
	);

	return (
		<ThemeProviderContext.Provider value={{ theme, setTheme }}>
			<Theme
				ref={observe}
				scaling={scale}
				radius="large"
				grayColor="auto"
				accentColor="gray"
				panelBackground="solid"
				style={{ background: 'var(--accent-panel)' }}
			>
				{children}
				{/* <ThemePanel /> */}
			</Theme>
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

	return context;
};
