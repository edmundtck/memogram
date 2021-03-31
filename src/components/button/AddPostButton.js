import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import styles from './AddPostButton.module.scss';

const AddPostButton = (props) => {
	return (
		<button className={styles.root} {...props}>
			<AddIcon fontSize="large" />
		</button>
	);
};

export default AddPostButton;
