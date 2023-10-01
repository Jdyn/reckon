import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Callout } from '@radix-ui/themes';

interface ErrorProps {
	text: string;
}

const Error = ({ text }: ErrorProps) => {
	return (
		<Callout.Root color="red" size="1">
			<Callout.Icon>
				<ExclamationCircleIcon width="18px" />
			</Callout.Icon>
			<Callout.Text>{text}</Callout.Text>
		</Callout.Root>
	);
};

export default Error;
