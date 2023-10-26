<script lang="ts">
	import ColorTag from '$lib/components/ColorTag.svelte';
	import { capitalizeEveryWord } from '$lib/utils/text-utils';
	import type { PageData } from './$types';

	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import { redirect } from '@sveltejs/kit';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let data: PageData;

	let { supabase } = data;
	$: ({ supabase } = data);

	let showModal = false;
	let personIdFee: number | null = null;

	if (data.fees_types && data.fees_types.length > 0 && !$page.url.searchParams.get('id')) {
		onMount(() => {
			if (data.fees_types && data.fees_types.length > 0) {
				goToGroup(data.fees_types[0].small_groups?.id);
			}
		});
	}

	const changeStatus = async () => {
		if (personIdFee) {
			toast.loading('Zmienianie statusu...');
			let fees_types_id = data.fees_types?.find(
				(fee_type) => fee_type.small_groups?.id.toString() === $page.url.searchParams.get('id')
			)?.id;
			const { error } = await supabase.rpc('changefeestatus', {
				fee_type_id: fees_types_id,
				person_id: personIdFee
			});
			toast.dismiss();
			if (error) {
				toast.error('Wystąpił błąd! - ' + error.message);
				console.log('Error:', error);
			} else {
				toast.success('Zmieniono status!');
				invalidateAll();
			}
		}
	};

	function getPaidStatus(payment_date: string | null): string {
		if (payment_date) {
			return 'Tak, w dniu ' + payment_date.split('-').reverse().join('-') + '.';
		}
		return 'Nie zapłacono.';
	}

	async function goToGroup(id: number | undefined) {
		if (id) {
			const newUrl = new URL($page.url);
			newUrl?.searchParams?.set('id', id.toString());
			if (browser) return await goto(newUrl);
			else throw redirect(302, newUrl);
		}
	}
</script>

<svelte:head>
	<title>Składki i opłaty</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
	<div class="container grid px-6 mx-auto">
		<h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Ewidencja harcerzy</h2>
		<!-- <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
			{data.fees_types?z.length > 0 ? data.fees_types[0].name : 'Brak składek'}
		</h4> -->
		<!-- Dropdown -->
		<!-- row -->
		<select class="py-2 px-3 w-full">
			{#if !data.fees_types || data.fees_types.length === 0}
				<option value="0">Brak składek</option>
			{:else}
				{#each data.fees_types as fee_type}
					<option
						value={fee_type.id}
						selected={fee_type.id.toString() === $page.url.searchParams.get('id')}
						on:click={() => {
							goToGroup(fee_type.small_groups?.id);
						}}
					>
						{fee_type.name}
					</option>
				{/each}
			{/if}
		</select>

		<div class="w-full mb-8 mt-4 overflow-hidden rounded-lg shadow-xs">
			<div class="w-full overflow-x-auto">
				<table class="w-full whitespace-no-wrap">
					<thead>
						<tr
							class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
						>
							<th class="px-4 py-3">Imię i Nazwisko</th>
							<th class="px-4 py-3">Funkcja</th>
							<th class="px-4 py-3">Zastęp</th>
							<th class="px-4 py-3">Czy zapłacono</th>
							<th class="px-4 py-3">Akcja</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
						{#each data.people as person}
							<!-- Same, but only with people in matching team/person relation -->
							<tr
								class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
								on:click={() => {
									personIdFee = person.people_id;
									showModal = true;
								}}
							>
								<td class="px-4 py-3">
									<div class="flex items-center text-sm">
										<!-- Avatar with inset shadow -->
										<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
											<img
												class="object-cover w-full h-full rounded-full"
												src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
												alt=""
												loading="lazy"
											/>
											<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
										</div>
										<div>
											<p class="font-semibold">
												{capitalizeEveryWord(person.people_name || 'Błąd')}
											</p>
											<p class="text-xs text-gray-600 dark:text-gray-400">
												{person.people_join_year || ''}
											</p>
										</div>
									</div>
								</td>
								<ColorTag
									color={person.roles_color || undefined}
									title={person.roles_name || undefined}
								/>
								<td class="px-4 py-3 text-sm">{person.small_groups_name || 'Brak zastępu'}</td>
								<td class="px-4 py-3 text-sm">
									{getPaidStatus(person.fees_payment_date)}
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center space-x-4 text-sm">
										<button
											class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
											aria-label="Edit"
										>
											<svg
												class="w-5 h-5"
												aria-hidden="true"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</main>
<Modal bind:showModal clickAction={changeStatus}>
	<h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">
		Czy na pewno chcesz zmienić status składki na {data.people.find(
			(person) => person.people_id === personIdFee
		)?.fees_payment_date
			? 'NIEZAPŁACONE'
			: 'ZAPŁACONE'}?
	</h2>
	<div class="py-3" />
</Modal>
