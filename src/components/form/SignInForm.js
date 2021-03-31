import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FormControl, TextField } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import Button from '../button/Button';

import { firestore, auth, provider } from '../../firebase/config';
import styles from './Form.module.scss';

const initialState = {
	email: '',
	password: ''
};

const SignInForm = () => {
	const [ form, setForm ] = useState(initialState);
	const [ error, setError ] = useState('');
	const history = useHistory();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value
		});
	};

	// Signing in with email and password
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await auth.signInWithEmailAndPassword(form.email, form.password);
			history.push('/');
		} catch (error) {
			setError(error.message);
		}
	};

	// 3. Creating of user in database
	const createUserOnDB = async (user) => {
		try {
			await firestore.collection('users').doc(user.uid).set({
				displayName: user.displayName,
				email: user.email
			});
		} catch (error) {
			throw new Error(error);
		}
	};

	// 2. To check google user exist in database, if not, need to create
	const checkGoogleUserExist = async (user) => {
		try {
			const snapshot = await firestore.collection('users').doc(user.uid).get();
			if (!snapshot.exist) {
				await createUserOnDB(user);
			}
		} catch (error) {
			throw new Error(error);
		}
	};

	// 1. When using google to sign in, need to check if user exist in database
	const handleGoogleSignIn = async () => {
		try {
			const result = await auth.signInWithPopup(provider);
			const user = result.user;
			await checkGoogleUserExist(user);
			history.push('/');
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<form className={styles.root} onSubmit={handleSubmit}>
			<FormControl fullWidth className={styles.control}>
				<TextField
					label="Email"
					type="email"
					className={styles.input}
					name="email"
					onChange={handleChange}
					value={form.email}
					required
					InputLabelProps={{ style: { fontSize: '1.6rem' } }}
					InputProps={{ style: { fontSize: '1.6rem' } }}
				/>
			</FormControl>
			<FormControl fullWidth className={styles.control}>
				<TextField
					label="Password"
					type="password"
					className={styles.input}
					name="password"
					onChange={handleChange}
					value={form.password}
					required
					InputLabelProps={{ style: { fontSize: '1.6rem' } }}
					InputProps={{ style: { fontSize: '1.6rem' } }}
				/>
			</FormControl>
			{error && (
				<div className={styles.error}>
					<ErrorIcon fontSize="large" />
					<span>{error}</span>
				</div>
			)}
			<div className={styles.actionsButton}>
				<Button>Sign In</Button>
				<Button type="button" onClick={handleGoogleSignIn} secondary>
					Sign In With Google
				</Button>
			</div>
		</form>
	);
};

export default SignInForm;
