import React, { useRef, useState } from 'react';
import styles from './DevPanel.css';
import { Button } from 'antd';
import CardWheel from './CardWheel.jsx';

export default function DevPanel() {
	const wheelRef = useRef();
	const [wheelIndex, setWheelIndex] = useState(0);

	return <div className={styles.wrapper}>
		<div className={styles.controlContainer}>
			<CardWheel ref={wheelRef} onChange={setWheelIndex}></CardWheel>
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
