import React, { useState, forwardRef, useImperativeHandle, useReducer } from 'react';
import Hammer from 'react-hammerjs';
import Bezier from 'bezier-js';
import styles from './CardWheel.css';
import Card from './Card.jsx';

/**
 * Calculate the (x, y) of a position on the wheel circuit
 * @param {Number} p_position the circuit position within range [-1, 1]
 */
function positionToXY(p_position) {
	const coerced = Math.max(-1, Math.min(1, p_position));
	const x = Math.sin((Math.PI / 2) * coerced);
	const y = Math.cos((Math.PI / 2) * coerced);
	return { x, y };
}

const springTimeInMs = 500;
function getSpringFunc(p_delta, p_velocity) {
	const bezier = new Bezier([
		{ x: 0, y: 0 },
		{ x: 1, y: p_velocity * springTimeInMs / 4 },
		{ x: 3, y: p_delta },
		{ x: 4, y: p_delta },
	]);
	return (p_process) => bezier.get(p_process).y;
}

function processReducer(process, change) {
	if (change === 'reset') {
		return 0;
	}
	if (isFinite(change)) {
		return process + change;
	}
	return process;
}
function useSpring(position, setPosition) {
	const [springFunc, setSpringFunc] = useState({});
	const [process, setProcess] = useReducer(processReducer, 0);
	const springing = !!springFunc.calculatePosition;

	function doSpring() {
		const currentTime = Date.now();
		requestAnimationFrame(() => {
			if (!springing) { return; }
			const processChange = (Date.now() - currentTime) / springTimeInMs;
			setProcess(processChange);
		});
	}

	function startSpring(p_delta, p_velocity) {
		setSpringFunc({ calculatePosition: getSpringFunc(p_delta, p_velocity)});
	}

	function stopSpring() {
		if (!springing) { return; }
		// Apply current spring distance into position
		setPosition(position + springFunc.calculatePosition(Math.min(1, process)));
		setSpringFunc({});
		setProcess('reset');
	}

	let springDistance = 0;
	if (springing) {
		if (process < 1) {
			springDistance = springFunc.calculatePosition(process);
			doSpring();
		} else {
			stopSpring();
		}
	}
	return { springDistance, startSpring, stopSpring, springing };
}

const CardWheel = forwardRef(({
	height = 360,
	width = 500,
	vanishingAt = 160,
	visiibleSide = 3,
	cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
}, ref) => {
	const wrapperStyle = {
		'--height': `${height}px`,
		'--width': `${width}px`,
	};

	const [position, setPosition] = useState(0);

	// Handle panning and springFunc
	const [panning, setPanning] = useState(false);
	const [panDistance, setPanDistance] = useState(0);
	const { springDistance, startSpring, stopSpring, springing } = useSpring(position, setPosition);
	function handlePanStart() {
		setPanning(true);
		stopSpring();
	}
	function handlePan(p_event) {
		setPanDistance(-p_event.deltaX * 2 / width);
	}
	function handlePanEnd(p_event) {
		const endPanDistance = -p_event.deltaX * 2 / width;
		const endPanVelocity = -p_event.velocityX * 2 / width;
		const endPostion = position + endPanDistance;
		setPanning(false);
		// Merge panDistance in position
		setPosition(endPostion);
		setPanDistance(0);
		// Start springFunc
		const targetPosition = endPostion + endPanVelocity * springTimeInMs * 0.5;
		const springDelta = Math.round(Math.max(0, Math.min(cards.length - 1, targetPosition))) - endPostion;
		startSpring(springDelta, endPanVelocity);
	}

	const visualPosition = position + panDistance + springDistance;

	useImperativeHandle(ref, () => ({
		get index() { return Math.round(visualPosition); },
	}));

	const items = cards.map((card, key) => {
		const itemPosition = key - visualPosition;
		const { x: moveRatio, y: shrinkRatio } = positionToXY(itemPosition / (visiibleSide + 1));
		const itemStyle = {
			'--move-ratio': moveRatio * (1 - vanishingAt / width),
			'--shrink-ratio': shrinkRatio,
			zIndex: Math.ceil(10000 * shrinkRatio), // z-index must be an integer
		};

		const [cardCovered, setCardCoverd] = useState(false);
		const focused = key === Math.round(visualPosition);

		return <div key={key} className={styles.item} style={itemStyle}>
			<div>
				<Card covered={cardCovered} onClick={() => {
					if (!panning && !springing && focused) {
						setCardCoverd(!cardCovered);
					}
				}}></Card>
			</div>
		</div>;
	});
	return <Hammer
		direction='DIRECTION_HORIZONTAL'
		onPanStart={handlePanStart}
		onPan={handlePan}
		onPanEnd={handlePanEnd}
		onPanCancel={handlePanEnd}
	><div className={styles.wrapper} style={wrapperStyle}>
		{items}
	</div></Hammer>
});


export default CardWheel;