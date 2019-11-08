import React from 'react';
import styles from './Card.css';
import { classNames } from '../utilities';

export default function Card({
	height = 320,
	width = 240,
	covered = false,
	onClick,
}) {
	const wrapperStyle = {
		'--height': `${height}px`,
		'--width': `${width}px`,
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
