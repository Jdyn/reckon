import { Button, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { useSignInMutation } from '@reckon/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [signIn] = useSignInMutation();
	const [form, set] = useState({ identifier: 'test@test.com', password: 'Password1234' });

	const navigate = useNavigate();

	const updateForm = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
		set({ ...form, [key]: e.target.value });
	};

	return (
		<Flex justify="center" align="center" height="100%">
			<Flex justify="center" gap="4" direction="column">
				<Heading>Sign in</Heading>
				<Flex gap="3" direction="column" asChild>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							signIn(form)
								.unwrap()
								.then(() => {
									navigate('/feed');
								});
						}}
					>
						<label>
							<Text weight="bold">Identifier</Text>
							<TextField.Input
								variant="soft"
								value={form['identifier']}
								onChange={(e) => updateForm(e, 'identifier')}
								placeholder="Email, username, or phone"
							/>
						</label>
						<label>
							<Text weight="bold">Password</Text>
							<TextField.Input
								variant="soft"
								value={form['password']}
								onChange={(e) => updateForm(e, 'password')}
								size="2"
								type="password"
								placeholder="Enter password"
							/>
						</label>
						<Flex direction="row" justify="end" gap="3">
							<Button type="button" variant="outline">
								Create an account
							</Button>
							<Button type="submit">Sign in</Button>
						</Flex>
					</form>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Login;
