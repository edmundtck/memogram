import React from 'react';

import { Container } from '@material-ui/core';
import SignInForm from '../../components/form/SignInForm';
import SignUpForm from '../../components/form/SignUpForm';

import styles from './Login.module.scss';

const Login = () => {
	return (
		<div className={styles.root}>
			<Container>
				<div className={styles.container}>
					<div className={styles.signIn}>
						<div className={styles.header}>
							<h3 className={styles.heading}>I have an account</h3>
							<span className={styles.subParagraph}>Sign in with your email and password</span>
						</div>
						<SignInForm />
					</div>

					<div className={styles.signUp}>
						<div className={styles.header}>
							<h3 className={styles.heading}>I do not have an account</h3>
							<span className={styles.subParagraph}>Sign up with your email and password</span>
						</div>
						<SignUpForm />
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Login;
