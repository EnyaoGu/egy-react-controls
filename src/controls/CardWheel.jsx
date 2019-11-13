import React, { useState, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import Hammer from 'react-hammerjs';
import styles from './CardWheel.css';
import Card from './Card.jsx';
import { useTransition } from '../utilities/transition';

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
const springSpeed = 1 / springTimeInMs;
function getSpringRefs(distance, velocity) {
	return [
		{ x: 0, y: 0 },
		{ x: 1, y: velocity * springTimeInMs / 4 },
		{ x: 3, y: distance },
		{ x: 4, y: distance },
	];
}

function coerceIndex(position, maxIndex) {
	return Math.max(0, Math.min(maxIndex, Math.round(position)));
}

const CardWheel = forwardRef(({
	onChange,
	height = 360,
	width = 500,
	vanishingAt = 120,
	visiibleSide = 3,
	cardHeight,
	cardWidth,
	onCardClick,
	cards = [],
}, ref) => {
	const wrapperStyle = {
		'--height': `${height}px`,
		'--width': `${width}px`,
	};

	const [index, setIndexState] = useState(0);
	const setIndex = useCallback((newIndex) => {
		setIndexState(newIndex);
		onChange && onChange(newIndex);
	}, onChange);
	const [indexSetterCache, setIndexSetterCache] = useState(NaN);
	const [position, setPosition] = useState(0);
	const [panning, setPanning] = useState(false);
	const [panDistance, setPanDistance] = useState(0);
	const [springStartVelocity, setSpringStartVelocity] = useState(0);

	const springTransitionSpeed = useMemo(() => !panning && position !== index ? springSpeed : 0, [panning, position, index]);
	const springTransitionRefs = useMemo(() => getSpringRefs(index - position, springStartVelocity), [position, index, springStartVelocity]);
	const [springDistance, springing, resetSpring] = useTransition(springTransitionSpeed, springTransitionRefs);

	// Pan handlers
	const handlePanStart = useCallback(() => {
		setPanning(true);
		// Merge springDistance into position
		setPosition(position + springDistance);
		resetSpring();
	}, [position, springDistance]);
	const handlePan = useCallback((p_event) => {
		const newPanDistance = -p_event.deltaX * 2 / width;
		setPanDistance(newPanDistance);
		const newIndex = coerceIndex(position + newPanDistance, cards.length - 1);
		setIndex(newIndex);
	}, [position, cards, width]);
	const handlePanEnd = useCallback((p_event) => {
		setPanning(false);

		const newPanDistance = -p_event.deltaX * 2 / width;
		const panEndVelocity = -p_event.velocityX * 2 / width;
		// Merge panDistance into position
		const panEndPostion = position + newPanDistance;
		setPosition(panEndPostion);
		setPanDistance(0);

		// Update index
		let targetIndex;
		if (isFinite(indexSetterCache)) {
			targetIndex = coerceIndex(indexSetterCache, cards.length - 1);
			setIndexSetterCache(NaN);
		} else {
			targetIndex = coerceIndex(panEndPostion + panEndVelocity * springTimeInMs * 0.5, cards.length - 1);
		}
		setIndex(targetIndex);
		setSpringStartVelocity(panEndVelocity);
	}, [position, indexSetterCache, cards, width]);
	useMemo(() => {
		if (!springing) {
			// Merge springDistance into position
			setPosition(position + springDistance);
			setSpringStartVelocity(0);
		}
	}, [springing]);

	useImperativeHandle(ref, () => ({
		get index() { return index },
		set index(p_index) {
			if (panning) { setIndexSetterCache(p_index); return; }
			resetSpring();
			const targetIndex = coerceIndex(p_index, cards.length - 1);
			setIndex(targetIndex);
			setSpringStartVelocity(0);
		},
		get moving() { return panning || springing; }
	}), [index, panning, cards, springing]);

	const visualPosition = position + panDistance + springDistance;
	const items = cards.map((card, cardIndex) => {
		const itemPosition = cardIndex - visualPosition;
		const { x: moveRatio, y: shrinkRatio } = positionToXY(itemPosition / (visiibleSide + 1));
		const itemStyle = {
			'--move-ratio': moveRatio * (1 - vanishingAt / width),
			'--shrink-ratio': shrinkRatio,
			zIndex: Math.ceil(10000 * shrinkRatio), // z-index must be an integer
		};

		return <div key={cardIndex} className={styles.item} style={itemStyle}>
			<Card
				covered={card.covered}
				front={card.front}
				back={card.back}
				rotate={-60 * moveRatio}
				onClick={() => onCardClick(cardIndex)}
				height={cardHeight}
				width={cardWidth}
			></Card>
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