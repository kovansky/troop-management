<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	onMount(() => {
		goto('/people');
	});
</script>

<main class="flex items-center w-full h-full">
	<div class="flex flex-col items-center justify-center w-full h-full">
		<h1 class="text-4xl font-bold text-center text-gray-700">Strona główna</h1>
		<p class="text-center text-3xl text-gray-500">Tu nic nie ma</p>
		<h1 class="text-5xl font-bold text-center text-gray-700">Jeszcze ;)</h1>
	</div>
</main>
