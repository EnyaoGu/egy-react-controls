import React, { useRef, useEffect } from 'react';
import styles from './DevPanel.css';
import { Button } from 'antd';
import CardWheel from './CardWheel.jsx';

export default function DevPanel() {
	const wheelRef = useRef();
	useEffect(() => {
		//
	}, []);
	return <div className={styles.wrapper}>
		<div className={styles.controlContainer}>
			<CardWheel ref={wheelRef}></CardWheel>
		</div>
		<div className={styles.debugPane}>
			<Button onClick={() => {
				//
			}}>Debug1</Button>
			<Button onClick={() => {
				setTimeout(() => {
					console.log('reset wheel index 4');
					wheelRef.current.index = 4;
				}, 1000);
			}}>Debug2</Button>
		</div>
	</div>
}
