import { Button, Card, Text, TextField } from '@radix-ui/themes';
import { useSignInMutation } from '@reckon/core';
import { useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

const Login = () => {
	const [signIn, { isSuccess }] = useSignInMutation();
	const navigate = useNavigate();

	useEffect(() => {
		if (isSuccess) {
			navigate('/feed');
		}
	}, [isSuccess, navigate]);

	return (
		<Card size="1">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					signIn({ identifier: 'test@test.com', password: 'Password1234' });
				}}
			>
				<Text>email, username, or phone</Text>
				<TextField.Root>
					<TextField.Input />
				</TextField.Root>
				<Text>Password</Text>
				<TextField.Root>
					<TextField.Input type="password" />
				</TextField.Root>
				<Button type="submit">Log in</Button>
			</form>
		</Card>
	);
};

export default Login;
