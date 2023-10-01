import { Button, Card, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { useSignInMutation } from '@reckon/core';
import { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

const Login = () => {
	const [signIn, { isSuccess }] = useSignInMutation();
	const [form, set] = useState({ identifier: 'test@test.com', password: 'Password1234' });

	const navigate = useNavigate();

	const updateForm = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
		set({ ...form, [key]: e.target.value });
	};

	return (
		<Flex justify="center" align="center" height="100%">
			<Card size="4" style={{ width: '300px' }} variant="surface">
				<Heading mb="4">Sign in</Heading>
				<Flex justify="center" gap="5" asChild direction="column">
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
							<Text weight="bold" size="2">
								Identifier
							</Text>
							<TextField.Input
								value={form['identifier']}
								onChange={(e) => updateForm(e, 'identifier')}
								placeholder="Email, username, or phone"
							/>
						</label>
						<label>
							<Text weight="bold" size="2">
								Password
							</Text>
							<TextField.Input
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
			</Card>
		</Flex>
	);
};

export default Login;
