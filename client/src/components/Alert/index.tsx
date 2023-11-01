import { AlertDialog, Button, ContextMenu, DropdownMenu, Flex } from '@radix-ui/themes';
import { forwardRef, useState } from 'react';

interface AlertDialogProps {
	children: React.ReactNode;
	title: string;
	description: string;
	action: string;
	onClick?: () => void;
	type: 'dropdown' | 'context';
}
const Alert = forwardRef<unknown, AlertDialogProps>(
	({ children, title, description, action, onClick, type }, forwardedRef) => {
		const [isOpen, setOpen] = useState(false);

		const Wrapper = type === 'dropdown' ? DropdownMenu.Item : ContextMenu.Item;

		return (
			<AlertDialog.Root open={isOpen} onOpenChange={(open) => setOpen(open)}>
				<AlertDialog.Trigger>
					<Wrapper
						onClick={(e) => {
							e.preventDefault();
							setOpen(true);
						}}>
						{children}
					</Wrapper>
				</AlertDialog.Trigger>
				<AlertDialog.Content style={{ maxWidth: 400 }}>
					<AlertDialog.Title align="center">{title}</AlertDialog.Title>
					<AlertDialog.Description align="center" color="gray">
						{description}
					</AlertDialog.Description>
					<Flex gap="3" mt="4" justify="end">
						<AlertDialog.Cancel>
							<Button variant="soft" color="gray">
								cancel
							</Button>
						</AlertDialog.Cancel>
						<AlertDialog.Action>
							<Button type="submit" variant="soft" color="red" onClick={onClick}>
								{action}
							</Button>
						</AlertDialog.Action>
					</Flex>
				</AlertDialog.Content>
			</AlertDialog.Root>
		);
	}
);

export default Alert;
