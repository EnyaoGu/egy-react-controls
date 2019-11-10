import React, { useState, useEffect } from 'react';
import styles from './Card.css';
import Bezier from 'bezier-js';

const flipFunction = (new Bezier([
	{ x: 0, y: 0},
	{ x: 0.4, y: 0},
	{ x: 0.6, y: 180},
	{ x: 1, y: 180},
]));
function calculateFlipAngle(p_process) {
	return flipFunction.get(p_process).y;
}

const flipTimeInMs = 500;

export default function Card({
	height = 320,
	width = 240,
	rotate = 0,
	covered = false,
	onClick,
}) {
	const [flipProcess, setFlipProcess] = useState(covered ? 1 : 0);
	const wrapperStyle = {
		'--height': `${height}px`,
		'--width': `${width}px`,
		'--rotate': `${rotate + calculateFlipAngle(flipProcess)}deg`,
	};

	const targetFlipProcess = covered ? 1 : 0;
	if (flipProcess !== targetFlipProcess) {
		const current = Date.now();
		setTimeout(() => {
			const newProcess = Math.max(0, Math.min(1, flipProcess + (covered ? 1 : -1) * (Date.now() - current) / flipTimeInMs));
			setFlipProcess(newProcess);
		}, 20);
	}

	return <div
		className={styles.wrapper}
		style={wrapperStyle}
		onClick={onClick}
	>
		<div className={styles.front}></div>
		<div className={styles.back}></div>
	</div>;
}
