import { useState, useMemo } from 'react';

export function usePropState(propValue, propOnChange, initValue, sideEffect) {
	const [stateValue, setStateValue] = useState(initValue);
	const value = useMemo(() => {
		const propValid = typeof propValue === typeof stateValue;
		if (propValid) {
			if (propValue !== stateValue) {
				// When prop value is changed but not by onChange
				setStateValue(propValue);
				sideEffect();
			}
			return propValue;
		}
		return stateValue;
	}, [propValue, stateValue]);
	const setValue = useMemo(() => propOnChange
		? (newValue) => {
			setStateValue(newValue);
			propOnChange(newValue);
		}
		: setStateValue
	, [propOnChange]);
	return [value, setValue]; 
}