import React from 'react';
import styles from './Card.css';
import { useTransition } from '../utilities/transition';

const flipTimeInMs = 500;
const flipSpeed = 1 / flipTimeInMs;
const flipTransitionRefs = [
	{ x: 0, y: 0},
	{ x: 0.3, y: 0},
	{ x: 0.7, y: 180},
	{ x: 1, y: 180},
];

const frontPlaceholder = <div className={styles.frontPlaceholder}>O</div>
const backPlaceholder = <div className={styles.backPlaceholder}>X</div>

function Card({
	height = 320,
	width = 240,
	front = frontPlaceholder,
	back = backPlaceholder,
	rotate = 0,
	covered = false,
	onClick,
}) {
	const [flipAngle] = useTransition(covered ? flipSpeed : -flipSpeed, flipTransitionRefs, covered ? 1 : 0);
	const wrapperStyle = {
		'--height': `${height}px`,
		'--width': `${width}px`,
		'--rotate': `${rotate + flipAngle}deg`,
	};

	return <div
		className={styles.wrapper}
		style={wrapperStyle}
		onClick={onClick}
	>
		<div className={styles.front}>{front}</div>
		<div className={styles.back}>{back}</div>
	</div>;
}

export default Card;