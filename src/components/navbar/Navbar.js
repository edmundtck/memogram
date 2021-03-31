import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Avatar } from '@material-ui/core';
import Button from '../button/Button';

import { UserContext } from '../../contexts/userContext';
import { auth } from '../../firebase/config';
import { nameInitial } from '../../helpers';
import logoLarge from '../../assets/logo-large.png';
import logoSmall from '../../assets/logo-small.png';
import styles from './Navbar.module.scss';

const Navbar = () => {
	const [ currentUser, setCurrentUser ] = useContext(UserContext);
	const history = useHistory();

	const handleLogout = async () => {
		try {
			await auth.signOut();
			setCurrentUser(null);
			history.push('/');
		} catch (error) {
			console.error(error.message);
		}
	};

	const handleLogin = () => {
		history.push('/login');
	};

	const handleLogo = () => {
		history.push('/');
	};

	const handleProfile = () => {
		history.push(`/profile/${currentUser.uid}`);
	};

	return (
		<div className={styles.root}>
			<Container>
				<div className={styles.container}>
					<picture className={styles.logo} onClick={handleLogo}>
						<source media="(min-width: 576px)" srcSet={logoLarge} />
						<img src={logoSmall} alt="Logo" />
					</picture>
					<div className={styles.actionsContainer}>
						{currentUser && (
							<Avatar className={styles.avatar} onClick={handleProfile}>
								{nameInitial(currentUser.displayName)}
							</Avatar>
						)}
						{currentUser ? (
							<Button onClick={handleLogout}>Logout</Button>
						) : (
							<Button onClick={handleLogin}>Login</Button>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Navbar;
