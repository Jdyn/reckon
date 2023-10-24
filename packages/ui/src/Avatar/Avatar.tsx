import { Avatar as AvatarPrimative } from '@radix-ui/themes';

import styles from './Avatar.module.css';
import { AvatarProps } from '@radix-ui/themes/dist/cjs/components/avatar';

export function getInitials(input: string): string {
	return input
				.split(' ')
				.map((word) => (word[0] ?? '' as string).toUpperCase())
				.slice(0, 2)
				.join('');
}

interface Props {
	text: string;
}

export function Avatar({ text, size }: Omit<AvatarProps, 'fallback'> & Props) {
	return (
		<AvatarPrimative className={styles.root} size={size} variant="solid" fallback={getInitials(text)} />
	);
}

Avatar.defaultProps = {
	width: '45px',
	height: '45px',
	size: '3'
};
