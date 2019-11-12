import React, { useState, useEffect } from 'react';
import styles from './Card.css';
import Bezier from 'bezier-js';
import { useTransition } from '../utilities/transition';

const flipTimeInMs = 500;
const flipSpeed = 1 / flipTimeInMs;
const flipTransitionRefs = [
	{ x: 0, y: 0},
	{ x: 0.3, y: 0},
	{ x: 0.7, y: 180},
	{ x: 1, y: 180},
];

export default function Card({
	height = 320,
	width = 240,
	rotate = 0,
	covered = false,
	onClick,
}) {
	const [flipAngle] = useTransition(covered ? flipSpeed : -flipSpeed, flipTransitionRefs);
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
		<div className={styles.front}></div>
		<div className={styles.back}></div>
	</div>;
}
