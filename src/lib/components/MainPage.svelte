<script lang="ts">
	import PageHeader from './PageHeader.svelte';

	export let title: string;
	export let subtitle: string;
	export let gotoUrl: string | null = null;
	export let buttonName: string = '';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<PageHeader {title} {subtitle} {gotoUrl} {buttonName} />
<div class="w-full mb-8 mt-4 overflow-hidden rounded-lg shadow-xs">
	<slot />
</div>
