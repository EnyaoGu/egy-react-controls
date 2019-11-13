import { useEffect, useMemo, useReducer } from 'react';
import Bezier from 'bezier-js';
import { addTickRender, removeTickRender } from './animationTicker';

function wrapTransFunc(refs) {
	const bezier = new Bezier(refs);
	return (process) => bezier.get(process).y;
}

function processReducer({ process }, change) {
	if (isFinite(change)) {
		const newProcess = Math.max(0, Math.min(1, process + change));
		const stillMoving = newProcess !== process;
		return { process: newProcess, moving: stillMoving };
	}
	switch(change) {
	case 'resetStart':
		return { process: 0, moving: false };
	case 'resetEnd':
		return { process: 0, moving: false };
	}
};

/**
 * Use an value that change with time align a bezier function
 * @param {Number} speed the transition speed in %/ms
 */
export function useTransition(speed, refs, initProcess = 0) {
	const [{ process, moving }, doProcess] = useReducer(processReducer, { process: initProcess, moving: false }); 

	useEffect(() => {
		doProcess(1 * speed);
		const tickRender = (tickLength) => {
			doProcess((tickLength || 1) * speed);
		};
		if (!moving) { return; }
		addTickRender(tickRender);
		return () => removeTickRender(tickRender);
	}, [moving, speed]);

	const transFunc = useMemo(() => wrapTransFunc(refs), [refs]);
	const value = useMemo(() => transFunc(process), [process, transFunc]);
	function resetStart() { doProcess('resetStart'); }
	function resetEnd() { doProcess('resetEnd'); }
	return [value, moving, resetStart, resetEnd];
}
