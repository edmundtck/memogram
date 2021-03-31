import React, { useState, useEffect } from 'react';

import { Container } from '@material-ui/core';
import PhotoModal from '../../components/modal/PhotoModal';
import Card from '../../components/card/Card';

import { firestore } from '../../firebase/config';
import styles from './Home.module.scss';

const Home = () => {
	const [ posts, setPosts ] = useState([]);
	const [ isOpen, setIsOpen ] = useState(false);
	const [ postId, setPostId ] = useState('');

	const handleClosePhotoModal = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		const unsub = firestore.collection('posts').orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
			const query = querySnapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id };
			});
			setPosts(query);
		});

		return () => unsub();
	}, []);

	return (
		<div className={styles.root}>
			<Container>
				<div className={styles.cardList}>
					{posts &&
						posts.map((post) => (
							<Card setPostId={setPostId} setIsOpen={setIsOpen} post={post} key={post.id} />
						))}
				</div>
			</Container>
			<PhotoModal isOpen={isOpen} handleClose={handleClosePhotoModal} postId={postId} />
		</div>
	);
};

export default Home;
