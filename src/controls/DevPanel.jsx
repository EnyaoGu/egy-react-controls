import React, { useState } from 'react';
import styles from './DevPanel.css';
import { Button } from 'antd';
import Card from './Card.jsx';

export default function DevPanel() {
	const [cardCovered, setCardCoverd] = useState(false);

	return <div className={styles.wrapper}>
		<div className={styles.controlContainer}>
				<Card covered={cardCovered}></Card>
		</div>
		<div className={styles.debugPane}>
			<Button onClick={() => setCardCoverd(!cardCovered)}>Flip</Button>
		</div>
	</div>
}
