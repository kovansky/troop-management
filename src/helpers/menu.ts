import { writable } from 'svelte/store';

export const pageMenu = writable([]);
export const sideMenuState = writable(false);

export const togglePageMenu = (name: string) => {
	pageMenu.update((pages) => {
		if (typeof pages[name] === 'undefined') {
			pages[name] = true;
		} else {
			pages[name] = !pages[name];
		}

		return pages;
	});
};

export const toggleSideMenu = () => {
	sideMenuState.update((v) => !v);
};

export const closeSideMenu = () => {
	sideMenuState.set(false);
};
