import React, { useContext } from 'react';
import moment from 'moment';
import _ from 'lodash';

import LikeButton from '../button/LikeButton';
import { Card as MuiCard, Avatar, CardMedia, CardHeader, CardContent } from '@material-ui/core';

import { UserContext } from '../../contexts/userContext';
import { nameInitial } from '../../helpers';
import styles from './Card.module.scss';

const Card = ({ post, setPostId, setIsOpen }) => {
	const { imageURL, user: { displayName }, likes, caption, createdAt, id } = post;
	const [ currentUser ] = useContext(UserContext);

	const displayLikes = () => {
		const likesNumber = likes.length;
		if (likesNumber > 1) return `${likesNumber} likes`;
		return `${likesNumber} like`;
	};

	const handleClick = () => {
		setPostId(id);
		setIsOpen(true);
	};

	return (
		<MuiCard className={styles.root}>
			<CardHeader
				avatar={<Avatar className={styles.avatar}>{nameInitial(displayName)}</Avatar>}
				title={<h3 className={styles.displayName}>{displayName}</h3>}
			/>
			<div className={styles.mediaWrapper} onClick={handleClick}>
				<div className={styles.backdrop} />
				<CardMedia className={styles.media} image={imageURL} title="Post" />
			</div>
			<CardContent>
				<div className={styles.likesContainer}>
					<span className={styles.likes}>{displayLikes()}</span>
					{currentUser && <LikeButton post={post} />}
				</div>
				<p>
					<span className={styles.name}>{displayName} </span>
					{_.truncate(caption, {
						length: 100,
						separator: ' '
					})}
				</p>
				<span className={styles.time}>{createdAt && moment(createdAt.toDate()).fromNow()}</span>
			</CardContent>
		</MuiCard>
	);
};

export default Card;
