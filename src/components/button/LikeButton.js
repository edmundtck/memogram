import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../contexts/userContext';
import { firestore } from '../../firebase/config';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import styles from './LikeButton.module.scss';

const LikeButton = ({ post }) => {
	const { likes, id } = post;
	const [ currentUser ] = useContext(UserContext);
	const [ userLikedPost, setUserLikedPost ] = useState(false);

	const handleLikeClick = async () => {
		const postRef = firestore.doc(`posts/${id}`);

		try {
			if (userLikedPost) {
				// If user has liked the post, remove the like when click
				await postRef.update({
					likes: likes.filter((like) => like.uid !== currentUser.uid)
				});
			} else {
				// If user did not like the post before, update the likes when click
				await postRef.update({
					likes: [ ...likes, { displayName: currentUser.displayName, uid: currentUser.uid } ]
				});
			}
			setUserLikedPost(!userLikedPost);
		} catch (error) {
			console.error('Error writing document: ', error);
		}
	};

	useEffect(
		() => {
			const matchUser = likes.find((like) => like.uid === currentUser.uid);
			if (!matchUser) return setUserLikedPost(false);
			setUserLikedPost(true);
		},
		[ currentUser, likes ]
	);

	return (
		<button onClick={handleLikeClick} className={styles.root}>
			{userLikedPost ? (
				<FavoriteIcon className={styles.icon} fontSize="large" />
			) : (
				<FavoriteBorderIcon className={styles.icon} fontSize="large" />
			)}
		</button>
	);
};

export default LikeButton;
