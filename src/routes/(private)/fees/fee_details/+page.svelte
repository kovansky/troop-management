<script lang="ts">
	import ColorTag from '$lib/components/ColorTag.svelte';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import MainPage from '$lib/components/MainPage.svelte';
	import TableView from '$lib/components/TableView.svelte';
	import PersonAvatarText from '$lib/components/PersonAvatarText.svelte';
	export let data: PageData;

	let showModal = false;
	let personIdFee: number | null = null;

	const changeStatus = async () => {
		if (personIdFee) {
			toast.loading('Zmienianie statusu...');
			let fees_types_id = $page.url.searchParams.get('id');
			const { status, error } = await fetch(`/api/fees/${personIdFee}`, {
				method: 'PUT',
				body: JSON.stringify({
					fees_types_id,
					personIdFee
				})
			}).then((res) => res.json());
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

	onMount(() => {
		if (!$page.url.searchParams.has('id')) {
			goto(`${$page.url}/fees`);
		}
	});
</script>

<MainPage
	title="Lista składek i opłat"
	subtitle="Wybrana składka: {data.fee_type?.name || 'Błąd'}"
	gotoUrl="/fees/fee_edit?id=${$page.url.searchParams.get('id')}&return=${$page.url.pathname +
		$page.url.search}"
	buttonName="Edytuj składkę/opłatę"
>
	<TableView labelList={['Imię i Nazwisko', 'Funkcja', 'Zastęp', 'Czy zapłacono?', 'Akcja']}>
		{#each data.people as person}
			<tr
				class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
				on:click={() => {
					personIdFee = person.id;
					showModal = true;
				}}
			>
				<PersonAvatarText picturesPromise={data.streamed.picturesList} {person} />
				<ColorTag color={person.roles?.color} title={person.roles?.name} />
				<td class="text-sm">{person.small_groups_name || 'Brak zastępu'}</td>
				<td class="text-sm w-1/4">
					{getPaidStatus(data.fees.find((fee) => fee.fk_person_id === person.id)?.payment_date)}
				</td>
				<td>
					<div class="flex items-center space-x-4 text-sm">
						<button
							class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
							aria-label="Edit"
						>
							<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
								/>
							</svg>
						</button>
					</div>
				</td>
			</tr>
		{/each}
	</TableView>
</MainPage>
<Modal bind:showModal clickAction={changeStatus} confirmText="Tak, zmień" cancelText="Nie, anuluj">
	<h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">
		Czy na pewno chcesz zmienić status składki na {data.fees.find(
			(fee) => fee.fk_person_id === personIdFee
		)?.payment_date
			? 'NIEZAPŁACONE'
			: 'ZAPŁACONE'}?
	</h2>
	<div class="py-3" />
</Modal>
