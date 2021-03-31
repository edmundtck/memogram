import React, { useEffect, useState, useContext } from 'react';

import { Container, Avatar } from '@material-ui/core';
import PhotoModal from '../../components/modal/PhotoModal';
import Loader from '../../components/loader/Loader';

import { UserContext } from '../../contexts/userContext';
import { nameInitial } from '../../helpers';
import { firestore } from '../../firebase/config';
import styles from './Profile.module.scss';

const Profile = () => {
	const [ isOpen, setIsOpen ] = useState(false);
	const [ postId, setPostId ] = useState('');
	const [ currentUser ] = useContext(UserContext);
	const [ userPosts, setUserPosts ] = useState([]);

	const handleModal = (postId) => {
		// set the value of the modal => pass down by props to modal
		setPostId(postId);
		// set modal to open
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	useEffect(
		() => {
			if (currentUser) {
				const unsub = firestore
					.collection('posts')
					.where('user.uid', '==', currentUser.uid)
					.orderBy('createdAt', 'desc')
					.onSnapshot((snapshot) => {
						const posts = snapshot.docs.map((doc) => {
							return { ...doc.data(), id: doc.id };
						});
						setUserPosts(posts);
					});

				return () => unsub();
			}
		},
		[ currentUser ]
	);

	if (!currentUser) return <Loader />;

	return (
		<div className={styles.root}>
			<Container>
				<div className={styles.header}>
					<Avatar className={styles.avatar}>{nameInitial(currentUser.displayName)}</Avatar>
					<div>
						<h2>{currentUser.displayName}</h2>
						<span>
							<strong>{userPosts.length}</strong> {userPosts.length > 1 ? 'Posts' : 'Post'}
						</span>
					</div>
				</div>
				<ul className={styles.postList}>
					{userPosts.map((post) => (
						<li key={post.id} className={styles.imageWrapper} onClick={() => handleModal(post.id)}>
							<div className={styles.backdrop} />
							<img className={styles.image} src={post.imageURL} alt="Post" />
						</li>
					))}
				</ul>
			</Container>
			<PhotoModal isOpen={isOpen} handleClose={handleClose} postId={postId} />
		</div>
	);
};

export default Profile;
