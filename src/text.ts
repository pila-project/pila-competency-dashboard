/* eslint-disable @typescript-eslint/no-explicit-any */

function makeCircularReplacer(): (key: string, value: any) => any {
	const seen = new WeakSet<any>();
	return (_key: string, value: any): any => {
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) {
				return;
			}
			seen.add(value);
		}
		return value;
	};
}

export function robustStringify(value: any) {
	return JSON.stringify(value, makeCircularReplacer());
}