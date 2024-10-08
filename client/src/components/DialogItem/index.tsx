import { Button, ContextMenu, Dialog, DropdownMenu, Flex } from '@radix-ui/themes';
import { ReactNode, forwardRef, useState } from 'react';

interface DialogItemProps {
	children: [ReactNode, ReactNode];
	title?: string;
	description?: string;
	action: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	type: 'dropdown' | 'context';
}
const DialogItem = forwardRef<unknown, DialogItemProps>(
	({ children, title, description, action, onClick, type }, forwardedRef) => {
		const [header, content] = children;
		const [isOpen, setOpen] = useState(false);

		const Wrapper = type === 'dropdown' ? DropdownMenu.Item : ContextMenu.Item;

		return (
			<Dialog.Root open={isOpen} onOpenChange={(open) => setOpen(open)}>
				<Dialog.Trigger>
					<Wrapper
						onClick={(e) => {
							e.preventDefault();
							setOpen(true);
						}}
					>
						{header}
					</Wrapper>
				</Dialog.Trigger>
				<Dialog.Content style={{ maxWidth: 500 }}>
					{title && <Dialog.Title>{title}</Dialog.Title>}
					{description && (
						<Dialog.Description align="center" color="gray">
							{description}
						</Dialog.Description>
					)}
					{content}
					<Flex gap="3" mt="4" justify="end">
						<Dialog.Close>
							<Button variant="soft" color="gray">
								Cancel
							</Button>
						</Dialog.Close>
						<Button type="submit" variant="soft" color="green" onClick={onClick}>
							{action}
						</Button>
					</Flex>
				</Dialog.Content>
			</Dialog.Root>
		);
	}
);

export default DialogItem;
