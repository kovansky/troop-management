<script lang="ts">
	import { goto } from '$app/navigation';

	export let title: string;
	export let subtitle: string;
	export let gotoUrl: `` | null;
	export let buttonName: string = '';
</script>

<div class="flex justify-between items-center">
	<div>
		<h2 class="mt-6 mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
			{title}
		</h2>
		<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
			{subtitle}
		</h4>
	</div>
	{#if gotoUrl}
		<button
			class="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:bg-green-500"
			on:click={() => goto(gotoUrl)}
		>
			{buttonName}
		</button>
	{/if}
</div>
