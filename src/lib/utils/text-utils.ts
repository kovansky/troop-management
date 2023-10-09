export function capitalizeEveryWord(str: string): string {
    return str.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}
