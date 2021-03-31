import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

const Button = ({ children, secondary, disabled, ...props }) => {
	return (
		<button
			{...props}
			className={classNames({
				[styles.root]: true,
				[styles.secondary]: secondary,
				[styles.disabled]: disabled
			})}
		>
			{children}
		</button>
	);
};

export default Button;
