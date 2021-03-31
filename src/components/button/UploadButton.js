import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

const UploadButton = ({ children, secondary = false, disabled = false, ...props }) => {
	return (
		<span
			className={classNames({
				[styles.root]: true,
				[styles.secondary]: secondary,
				[styles.disabled]: disabled
			})}
			{...props}
		>
			{children}
		</span>
	);
};

export default UploadButton;
