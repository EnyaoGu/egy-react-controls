import React from 'react';
import styles from './Card.module.css';
import { classNames } from '../utilities';

export default function Card({ covered = false, onClick }) {
	const wrapperStyle = {
		'--card-height': `${320}px`,
		'--card-width': `${240}px`,
	};
	return <div
		className={classNames(styles.wrapper, covered && styles.covered)}
		style={wrapperStyle}
		onClick={onClick}
	>
		<div className={styles.front}></div>
		<div className={styles.back}></div>
	</div>;
}
