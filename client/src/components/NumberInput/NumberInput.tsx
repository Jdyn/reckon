import { NumberInputProps, NumberInput as Primative } from '@ark-ui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@radix-ui/themes';
import { Ref, forwardRef } from 'react';
import { useController, useForm } from 'react-hook-form';

import styles from './NumberInput.module.css';

interface Props extends NumberInputProps {
	name: string;
}

export const NumberInput = ({ name, ...props }: Props) => {
	const { field } = useController({
		name,
		rules: { required: true }
	});

	const { onChange, ...fieldProps } = field;
	return (
		<Primative.Root
			className={styles.root}
			{...fieldProps}
			{...props}
			onValueChange={(details) => {
				console.log(details)
				isNaN(details.valueAsNumber)
					? field.onChange(0)
					: field.onChange(details.valueAsNumber);
			}}
		>
			<Primative.Scrubber />
			<Primative.Input className={styles.input} />
			<Primative.Control className={styles.control}>
				<Primative.IncrementTrigger className={styles.trigger}>
					<PlusSmallIcon width="18px" height="14px" />
				</Primative.IncrementTrigger>
				<Primative.DecrementTrigger className={styles.trigger}>
					<MinusSmallIcon width="14px" />
				</Primative.DecrementTrigger>
			</Primative.Control>
		</Primative.Root>
	);
};
