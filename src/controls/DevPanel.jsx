import React from 'react';
import styles from './DevPanel.css';
import { Button } from 'antd';
import CardWheel from './CardWheel.jsx';

export default function DevPanel() {
	return <div className={styles.wrapper}>
		<div className={styles.controlContainer}>
			<CardWheel></CardWheel>
		</div>
		<div className={styles.debugPane}>
			<Button>Flip</Button>
		</div>
	</div>
}
