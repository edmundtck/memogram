import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Paper, Container } from '@material-ui/core';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Navbar from './components/navbar/Navbar';
import Loader from './components/loader/Loader';
import AddPostButton from './components/button/AddPostButton';
import AddPostModal from './components/modal/AddPostModal';

import { UserContext } from './contexts/userContext';
import { auth, firestore } from './firebase/config';
import styles from './styles/App.module.scss';

const App = () => {
	const [ currentUser, setCurrentUser ] = useContext(UserContext);
	const [ isOpen, setIsOpen ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(true);

	const handleAddPostClick = () => {
		setIsOpen(true);
	};

	const handleAddPostClose = () => {
		setIsOpen(false);
	};

	useEffect(
		() => {
			const unsub = auth.onAuthStateChanged((user) => {
				if (user) {
					// get the user uid, find the doc with the same uid, fetch the user from firestore
					// pass the data to setCurrentUser
					firestore.collection('users').doc(user.uid).onSnapshot((doc) => {
						const { displayName, email } = doc.data();
						setCurrentUser({
							displayName,
							email,
							uid: user.uid
						});
					});
					// User is sign in
				} else {
					// User is sign out
					setIsLoading(false);
				}
			});
			return () => unsub();
		},
		[ setCurrentUser ]
	);

	useEffect(
		() => {
			if (currentUser) {
				setIsLoading(false);
			}
		},
		[ currentUser ]
	);

	if (isLoading) return <Loader />;

	return (
		<div className={styles.app}>
			<Navbar />
			<Container>
				<Paper square className={styles.paper}>
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<Route exact path="/login">
							<Login />
						</Route>
						<Route exact path="/profile/:uid">
							<Profile />
						</Route>
					</Switch>
					{currentUser && <AddPostButton onClick={handleAddPostClick} />}
				</Paper>
			</Container>
			<AddPostModal isOpen={isOpen} handleAddPostClose={handleAddPostClose} />
		</div>
	);
};

export default App;
