import React, { useState }from 'react';
import styles from './CardWheel.css';
import Card from './Card.jsx';
import { classNames } from '../utilities';

export default function CardWheel({
	height = 320,
	width = 240,
}) {
	const [index, setIndex] = useState(0);
	const wrapperStyle = {
		'--height': `${height}px`,
		'--width': `${width}px`,
	};

	const cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((card, key) => {
		const [cardCovered, setCardCoverd] = useState(false);
		const classes = [styles.item];
		const diff = key - index;
		switch (diff) {
		case -2:
			classes.push(styles.l2);
			break;
		case -1:
			classes.push(styles.l1);
			break;
		case 0:
			break;
		case 1:
			classes.push(styles.r1);
			break;
		case 2:
			classes.push(styles.r2);
			break;
		default:
			classes.push(diff > 0 ? styles.rx : styles.lx);
			break;
		}

		return <div key={key} className={classNames(...classes)}>
			<Card covered={cardCovered} onClick={() => {
				if (!diff) {
					setCardCoverd(!cardCovered);
				} else {
					setIndex(index + Math.sign(diff));
				}
			}}></Card>
		</div>;
	});
	return <div className={styles.wrapper} style={wrapperStyle}>{cards}</div>;
}