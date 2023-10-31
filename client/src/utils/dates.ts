export function formatTimeAgo(dateString: string, ago = true): string {
	const currentDate = new Date();
	const inputDate = new Date(dateString);
	const seconds = Math.floor((currentDate.getTime() - inputDate.getTime()) / 1000);
	const intervals = [
		{ label: 'w', secondsInInterval: 604800 },
		{ label: 'd', secondsInInterval: 86400 },
		{ label: 'h', secondsInInterval: 3600 },
		{ label: 'm', secondsInInterval: 60 },
		{ label: 's', secondsInInterval: 1 }
	];

	for (const interval of intervals) {
		const count = Math.floor(seconds / interval.secondsInInterval);
		if (count >= 1) {
			return `1${interval.label} ${ago ? 'ago' : ''}`
		}
	}

	return 'Just now';
}
