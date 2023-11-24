<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { sideMenuState, closeSideMenu } from '../../helpers/menu';
	import SideBar from './sidebar.svelte';

	import { clickOutside } from '../../lib/ioevents/click';
	import { keydownEscape } from '../../lib/ioevents/keydown';
	import Header from './header.svelte';
	import { navigating } from '$app/stores';

	import type { LayoutData } from './$types';
	import Spinner from '$lib/components/Spinner.svelte';

	export let data: LayoutData;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (!_session) goto('/auth');
			else if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<!-- OLD -->

<section id="body">
	<div class="flex h-screen bg-base-200" class:overflow-hidden={$sideMenuState}>
		<!-- Desktop sidebar -->
		<aside class="z-20 hidden w-64 overflow-y-auto bg-base-100 md:block flex-shrink-0">
			<SideBar />
		</aside>

		<!-- Mobile sidebar -->
		<!-- Backdrop -->
		{#if $sideMenuState}
			<div
				class="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
			/>
			<aside
				class="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden"
				use:clickOutside={['nav-mobile-hamburger']}
				on:click-outside={closeSideMenu}
				use:keydownEscape
				on:keydown-escape={closeSideMenu}
			>
				<SideBar />
			</aside>
		{/if}

		<div class="flex flex-col flex-1 w-full">
			<Header {data} />
			<main class="main-normal">
				<div class="container grid px-6 mx-auto">
					{#if $navigating}
						<Spinner />
					{:else}
						<slot />
					{/if}
				</div>
			</main>
		</div>
	</div>
</section>
