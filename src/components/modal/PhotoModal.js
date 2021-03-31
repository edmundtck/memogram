import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';

import { Avatar, Dialog } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import LikeButton from '../../components/button/LikeButton';

import { UserContext } from '../../contexts/userContext';
import { nameInitial } from '../../helpers';
import { firestore } from '../../firebase/config';
import styles from './PhotoModal.module.scss';

const initialState = {
	id: '',
	user: {
		uid: '',
		displayName: ''
	},
	likes: [],
	imageURL: '',
	caption: '',
	createdAt: null
};

const PhotoModal = ({ isOpen, handleClose, postId }) => {
	const [ currentUser ] = useContext(UserContext);
	const [ post, setPost ] = useState(initialState);
	const { user: { displayName }, likes, imageURL, caption, createdAt } = post;

	useEffect(
		() => {
			if (postId) {
				const unsub = firestore.collection('posts').doc(postId).onSnapshot((doc) => {
					setPost({ ...doc.data(), id: doc.id });
				});
				return () => unsub();
			}
		},
		[ postId ]
	);

	const calculateLikes = () => {
		const likesNumber = likes.length;
		if (likesNumber > 1) return `${likesNumber} likes`;
		return `${likesNumber} like`;
	};

	return (
		<Dialog maxWidth="lg" open={isOpen} onClose={handleClose}>
			<div className={styles.root}>
				<div className={styles.close} onClick={handleClose}>
					<CloseIcon fontSize="large" />
				</div>
				<div className={styles.imageWrapper}>
					<img src={imageURL} className={styles.image} alt="Post" />
				</div>
				<div>
					<div className={styles.content}>
						<div className={styles.header}>
							<Avatar className={styles.avatar}>{nameInitial(displayName)}</Avatar>
							<h2 className={styles.displayName}>{displayName}</h2>
						</div>
						<div>
							<div className={styles.likes}>
								<strong>{calculateLikes()}</strong>
								<span>{currentUser && <LikeButton post={post} />}</span>
							</div>
							<div>
								<strong>{displayName} </strong>
								{caption}
							</div>
							<span className={styles.time}>{createdAt && moment(createdAt.toDate()).fromNow()}</span>
						</div>
					</div>
				</div>
			</div>
		</Dialog>
	);
};

export default PhotoModal;

/**
 * Props -> post exmaple
 */
// 	{
//     "user": {
//         "uid": "qTPCHdCxlzfXVrn2yaps2T51qjl2",
//         "displayName": "Hello Kitty"
//     },
//     "likes": [],
//     "imageURL": "https://firebasestorage.googleapis.com/v0/b/memogram-f0134.appspot.com/o/black-red-background.jpg?alt=media&token=8686318c-2a5b-4e02-8338-9b8f92124920",
//     "caption": "Nice background",
//     "createdAt": {
//         "seconds": 1616988743,
//         "nanoseconds": 372000000
//     }
// }
