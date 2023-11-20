import { NumberInputProps, NumberInput as Primative } from '@ark-ui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { Flex, Text } from '@radix-ui/themes';
import { Ref, forwardRef } from 'react';
import { useController, useForm } from 'react-hook-form';
import { money as createMoney } from 'money-lib/v2';
import styles from './NumberInput.module.css';

interface Props extends NumberInputProps {
	name: string;
	money: boolean;
}

export const NumberInput = ({ name, money, disabled, onValueChange, ...props }: Props) => {
	const { field } = useController({
		name,
		rules: { required: true }
	});

	const { onChange, ...fieldProps } = field;
	return !disabled ? (
		<Primative.Root
			className={styles.root}
			{...fieldProps}
			{...props}
			onValueChange={(details) => {
				onValueChange && onValueChange(details);
				field.onChange(details.value);
			}}
			clampValueOnBlur
		>
			<Primative.Scrubber />
			{/* {money && (
				<Text trim="both" align="center">
					$
				</Text>
			)} */}
			<Primative.Input className={styles.input} />
			<Primative.Control className={styles.control}>
				<Primative.IncrementTrigger className={styles.trigger}>
					<PlusSmallIcon width="14px" height="14px" />
				</Primative.IncrementTrigger>
				<Primative.DecrementTrigger className={styles.trigger}>
					<MinusSmallIcon width="14px" />
				</Primative.DecrementTrigger>
			</Primative.Control>
		</Primative.Root>
	) : (
		<Flex className={styles.root}>
			<Text>{field.value}</Text>
		</Flex>
	);
};

NumberInput.defaultProps = {
	money: false
};
