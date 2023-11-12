export function capitalizeEveryWord(str: string): string {
    return str.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

export function getFirstLetters(str: string): string {
    return str.match(/\b(\w)/g).join('').toLocaleUpperCase();
}