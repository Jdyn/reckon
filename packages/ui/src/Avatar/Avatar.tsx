import * as AvatarPrimative from '@radix-ui/react-avatar';
import { Text } from '@radix-ui/themes';

import styles from './Avatar.module.css';

function getInitials(input: string): string {
	return input
				.split(' ')
				.map((word) => (word[0] ?? '' as string).toUpperCase())
				.slice(0, 2)
				.join('');
}

interface Props {
	text: string;
	width?: string;
	height?: string;
}

export function Avatar({ text, width, height }: Props) {
	return (
		<AvatarPrimative.Root className={styles.root}>
			{/* <AvatarPrimative.Image
        className={styles.image}
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
        alt="Colm Tuite"
      /> */}
			<AvatarPrimative.Fallback style={{ width, height }} className={styles.fallback} delayMs={0}>
				<Text>{getInitials(text)}</Text>
			</AvatarPrimative.Fallback>
		</AvatarPrimative.Root>
	);
}

Avatar.defaultProps = {
	width: '45px',
	height: '45px'
};
