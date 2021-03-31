import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FormControl, TextField } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import Button from '../button/Button';

import { auth, firestore } from '../../firebase/config';
import styles from './Form.module.scss';

const initialState = {
	displayName: '',
	email: '',
	password: '',
	confirmPassword: ''
};

const SignUpForm = () => {
	const [ form, setForm ] = useState(initialState);
	const [ error, setError ] = useState('');
	const history = useHistory();

	const createUserOnDB = async (user) => {
		try {
			await firestore.collection('users').doc(user.uid).set({
				displayName: form.displayName,
				email: user.email
			});
		} catch (error) {
			throw new Error(error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.password !== form.confirmPassword) return setError('Password is not the same.');

		try {
			const userCredential = await auth.createUserWithEmailAndPassword(form.email, form.password);
			const user = userCredential.user;
			// Create new user record in firestore
			await createUserOnDB(user);
			history.push('/');
		} catch (error) {
			setError(error.message);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value
		});
	};

	return (
		<form className={styles.root} onSubmit={handleSubmit}>
			<FormControl fullWidth className={styles.control}>
				<TextField
					label="Display Name"
					type="text"
					className={styles.input}
					name="displayName"
					value={form.displayName}
					onChange={handleChange}
					required
					InputLabelProps={{ style: { fontSize: '1.6rem' } }}
					InputProps={{ style: { fontSize: '1.6rem' } }}
				/>
			</FormControl>
			<FormControl fullWidth className={styles.control}>
				<TextField
					label="Email"
					type="email"
					className={styles.input}
					name="email"
					value={form.email}
					onChange={handleChange}
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
					value={form.password}
					onChange={handleChange}
					required
					InputLabelProps={{ style: { fontSize: '1.6rem' } }}
					InputProps={{ style: { fontSize: '1.6rem' } }}
				/>
			</FormControl>
			<FormControl fullWidth className={styles.control}>
				<TextField
					label="Confirm Password"
					type="password"
					className={styles.input}
					name="confirmPassword"
					value={form.confimPassword}
					onChange={handleChange}
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
				<Button>Sign Up</Button>
			</div>
		</form>
	);
};

export default SignUpForm;
