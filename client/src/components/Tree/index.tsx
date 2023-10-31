import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { animated, useSpring } from '@react-spring/web';
import React, { useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';

import styles from './Tree.module.css';

function usePrevious<T>(value: T) {
	const ref = useRef<T>();
	useEffect(() => void (ref.current = value), [value]);
	return ref.current;
}

const Tree = React.memo<
	React.HTMLAttributes<HTMLDivElement> & {
		defaultOpen?: boolean;
		name: string | JSX.Element;
	}
>(({ children, name, style, defaultOpen = true }) => {
	const [isOpen, setOpen] = useState(defaultOpen);
	const previous = usePrevious(isOpen);
	const [ref, { height: viewHeight }] = useMeasure();

	const { height, opacity, y } = useSpring({
		from: { height: 0, opacity: 0, y: 0 },
		to: {
			height: isOpen ? viewHeight : 0,
			opacity: isOpen ? 1 : 0,
			y: isOpen ? 0 : 40
		}
	});

	return (
		<Flex direction="column" className={styles.root}>
			<Flex gap="2" align="center">
				<animated.div style={{ opacity: children ? 1 : 0.3 }}>
					<IconButton size="1" variant="ghost" style={{ margin: 0}} onClick={() => setOpen(!isOpen)}>
						{isOpen ? <MinusIcon width="14px" /> : <PlusIcon width="14px" />}
					</IconButton>
				</animated.div>
				<Text className={styles.label} color="gray" weight="medium" size="2" trim="both">
					{name}
				</Text>
			</Flex>
			<Flex direction="column" asChild>
				<animated.div
					style={{
						opacity,
						height: isOpen && previous === isOpen ? 'auto' : height
					}}>
					<Flex direction="column" asChild>
						<animated.div ref={ref}>{children}</animated.div>
					</Flex>
				</animated.div>
			</Flex>
		</Flex>
	);
});

export default Tree;
