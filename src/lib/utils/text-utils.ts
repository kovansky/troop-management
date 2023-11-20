export function capitalizeEveryWord(str: string): string {
	return str.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

export function getFirstLetters(str: string): string {
	const str_parts = str.split(' ');
	return str_parts
		.map((part) => part[0])
		.join('')
		.toLocaleUpperCase();
}
