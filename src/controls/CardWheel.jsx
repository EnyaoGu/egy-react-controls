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
	const y = 1 - Math.abs(coerced);
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
function useSpring(positionBeforePan, setPositionBeforePan) {
	const [springFunc, setSpringFunc] = useState({});
	const [process, setProcess] = useReducer(processReducer, 0);
	const springing = !!springFunc.calculatePosition;

	function doSpring() {
		const currentTime = Date.now();
		setTimeout(() => {
			if (!springing) { return; }
			const processChange = (Date.now() - currentTime) / springTimeInMs;
			setProcess(processChange);
		}, 20);
	}

	function startSpring(p_delta, p_velocity) {
		setSpringFunc({ calculatePosition: getSpringFunc(p_delta, p_velocity)});
	}

	function stopSpring() {
		if (!springing) { return; }
		// Apply current spring distance into position
		setPositionBeforePan(positionBeforePan + springFunc.calculatePosition(Math.min(1, process)));
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
	vanishingAt = 120,
	visiibleSide = 3,
	cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
}, ref) => {
	const wrapperStyle = {
		'--height': `${height}px`,
		'--width': `${width}px`,
	};

	const [index, setIndex] = useState(0);
	const [indexSetterCache, setIndexSetterCache] = useState(NaN);
	const [positionBeforePan, setPositionBeforePan] = useState(0);
	function coerceIndex(p_position) {
		return Math.max(0, Math.min(cards.length - 1, Math.round(p_position)));
	}

	// Handle panning with spring
	const [panning, setPanning] = useState(false);
	const [panDistance, setPanDistance] = useState(0);
	const { springDistance, startSpring, stopSpring, springing } = useSpring(positionBeforePan, setPositionBeforePan);
	function handlePanStart() {
		setPanning(true);
		stopSpring();
	}
	function handlePan(p_event) {
		const newPanDistance = -p_event.deltaX * 2 / width;
		setPanDistance(newPanDistance);
		setIndex(coerceIndex(positionBeforePan + newPanDistance));
	}
	function handlePanEnd(p_event) {
		setPanning(false);
		const newPanDistance = -p_event.deltaX * 2 / width;
		const panEndVelocity = -p_event.velocityX * 2 / width;
		// Merge panDistance into positionBeforePan
		const panEndPostion = positionBeforePan + newPanDistance;
		setPositionBeforePan(panEndPostion);
		setPanDistance(0);

		let targetIndex;
		if (isFinite(indexSetterCache)) {
			targetIndex = coerceIndex(indexSetterCache);
			setIndexSetterCache(NaN);
		} else {
			targetIndex = coerceIndex(panEndPostion + panEndVelocity * springTimeInMs * 0.5)
		}
		setIndex(targetIndex);

		const springDelta = targetIndex - panEndPostion;
		startSpring(springDelta, panEndVelocity);
	}

	const visualPosition = positionBeforePan + panDistance + springDistance;

	useImperativeHandle(ref, () => ({
		get index() { return index; },
		set index(p_index) {
			if (panning) { setIndexSetterCache(p_index); return; }
			stopSpring();
			const targetIndex = coerceIndex(p_index);
			setIndex(targetIndex);
			const springDelta = targetIndex - visualPosition;
			startSpring(springDelta, 0);
		},
	}));

	const items = cards.map((card, key) => {
		const itemPosition = key - visualPosition;
		const { x: moveRatio, y: shrinkRatio } = positionToXY(itemPosition / (visiibleSide + 1));
		const itemStyle = {
			'--move-ratio': moveRatio * (1 - vanishingAt / width),
			'--shrink-ratio': shrinkRatio,
			zIndex: Math.ceil(10000 * shrinkRatio), // z-index must be an integer
		};

		const [cardCovered, setCardCovered] = useState(false);

		return <div key={key} className={styles.item} style={itemStyle}>
			<div>
				<Card
					covered={cardCovered}
					rotate={-60 * moveRatio}
					animation={!panning && !springing}
					onClick={() => {
						if (!panning && !springing) {
							setCardCovered(!cardCovered);
						}
					}}
				></Card>
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