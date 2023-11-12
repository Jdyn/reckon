export const evenSplit = (oldCharges: Record<string, any>, total: string) => {
	const newCharges = { ...oldCharges };

	try {
		const count = Object.keys(newCharges).length;
		const divided = parseFloat(total) / count;
		const rounded = Math.round(divided * 100) / 100;
		const remainder = parseFloat(total) - rounded * count;

		let given = false;

		if (!isNaN(rounded)) {
			for (const key in newCharges) {
				if (!given) {
					newCharges[key] = { ...newCharges[key], amount: (rounded + remainder).toString() };
					given = true;
				} else {
					newCharges[key] = { ...newCharges[key], amount: rounded.toString() };
				}
			}
		}

		return newCharges;
	} catch (e) {
		return oldCharges;
	}
};

export function deepEqual(obj1: any, obj2: any): boolean {
	if (obj1 === obj2) {
		return true;
	}

	if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
		return false;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
}
