import React, { useRef } from 'react';
import styles from './DevPanel.css';
import { Button } from 'antd';
import CardWheel from './CardWheel.jsx';

export default function DevPanel() {
	const wheelRef = useRef();
	return <div className={styles.wrapper}>
		<div className={styles.controlContainer}>
			<CardWheel ref={wheelRef}></CardWheel>
		</div>
		<div className={styles.debugPane}>
			<Button onClick={() => console.log(wheelRef.current.index)}>Debug</Button>
		</div>
	</div>
}
