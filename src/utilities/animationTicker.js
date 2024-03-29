const tickRenders = new Set;

let animationFrameID = null;
function executeTickRenders(lastTick) {
	const currentTick = Date.now();
	const tickLength = currentTick - lastTick;
	if (tickLength) {
		tickRenders.forEach((tickRender) => tickRender(tickLength));
	}
	if (tickRenders.size) {
		animationFrameID = requestAnimationFrame(() => executeTickRenders(currentTick));
	}
}

export function addTickRender(p_callback) {
	if (!tickRenders.size) {
		requestAnimationFrame(() => executeTickRenders(Date.now()));
	}
	tickRenders.add(p_callback);
}

export function removeTickRender(p_callback) {
	tickRenders.delete(p_callback);
	if (!tickRenders.size) {
		cancelAnimationFrame(animationFrameID);
	}
}