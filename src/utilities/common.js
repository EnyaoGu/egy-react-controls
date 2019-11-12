export function classNames(...args) {
	return args.filter((className) => className).join(' ');
};