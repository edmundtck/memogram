import React from 'react';
import LoaderSpinner from 'react-loader-spinner';
import styles from './Loader.module.scss';

const Loader = () => {
	return (
		<div className={styles.root}>
			<LoaderSpinner type="Puff" color={styles.colorPrimary} height={100} width={100} />
		</div>
	);
};

export default Loader;
