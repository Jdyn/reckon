import { money as createMoney } from 'money-lib/v2';

export const evenSplit = (oldCharges: Record<string, any>, total: string) => {
	const newCharges = { ...oldCharges };

	const count = Object.keys(newCharges).length;
	const divided = createMoney(total as any).div(count);
	const remainder = createMoney(total as any).sub(divided.mul(count));
	let given = false;

	for (const key in newCharges) {
		if (!given) {
			newCharges[key] = { ...newCharges[key], amount: divided.add(remainder).string() };
			given = true;
			continue;
		}

		newCharges[key] = { ...newCharges[key], amount: divided.string() };
	}

	return { newCharges, split: `${divided}` };
};

export const perPersonSplit = (oldCharges: Record<string, any>, amount: string) => {
	const newCharges = { ...oldCharges };

	try {
		for (const key in newCharges) {
			newCharges[key] = { ...newCharges[key], amount };
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
