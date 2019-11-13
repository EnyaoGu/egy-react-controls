import React, { useRef, useState, useReducer } from 'react';
import styles from './DevPanel.css';
import { Button } from 'antd';
import CardWheel from './CardWheel.jsx';

const initCards = [
	{ covered: true },
	{ covered: false },
	{ covered: true },
	{ covered: false },
	{ covered: true },
	{ covered: false },
	{ covered: true },
	{ covered: false },
	{ covered: true },
	{ covered: false },
];
function cardsReducer(cards, action) {
	switch(action.type) {
	case 'flip':
		cards[action.index].covered = !cards[action.index].covered;
		break;
	}
	return [...cards];
}

export default function DevPanel() {
	const wheelRef = useRef();
	const [wheelIndex, setWheelIndex] = useState(0);

	const [cards, changeCards] = useReducer(cardsReducer, initCards);

	return <div className={styles.wrapper}>
		<div className={styles.controlContainer}>
			<CardWheel
				ref={wheelRef}
				onChange={setWheelIndex}
				cards={cards}
				onCardClick={(index) => !wheelRef.current.moving && changeCards({ type: 'flip', index })}
			></CardWheel>
		</div>
		<div className={styles.debugPane}>
			<div>{wheelIndex}</div>
			<Button onClick={() => {
				setTimeout(() => {
					console.log('reset wheel index 4');
					wheelRef.current.index = 4;
				}, 1000);
			}}>Debug</Button>
		</div>
	</div>
}
