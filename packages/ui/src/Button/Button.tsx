import { Button as ButtonPrimitive } from '@radix-ui/themes';
import { forwardRef } from 'react';

import styles from './Button.module.css';

export const Button: typeof ButtonPrimitive = forwardRef(({ children, ...props }, ref) => {
	return (
		<ButtonPrimitive {...props} className={styles.button} ref={ref} variant="soft">
			{children}
		</ButtonPrimitive>
	);
});
