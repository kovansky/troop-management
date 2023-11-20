<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { capitalizeEveryWord } from '$lib/utils/text-utils';

	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import DetailsPage from '$lib/components/DetailsPage.svelte';
	export let data: PageData;

	let returnPath = '/fees';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('return')) {
			returnPath = urlParams.get('return');
		}
	});

	const saveFeeType = async (event) => {
		const formData = new FormData(event.target);

		const method = $page.url.searchParams.get('id') ? 'PUT' : 'POST';
		const url = $page.url.searchParams.get('id')
			? `/api/fees/types/` + $page.url.searchParams.get('id')
			: `/api/fees/types/`;
		const { status, body } = await fetch(url, {
			method,
			body: formData
		}).then((res) => res.json());

		if (status === 200 || status === 201) {
			toast.success('Zapisano!');
			goto(returnPath, { invalidateAll: true });
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};

	const deleteFeeType = async (event) => {
		if (!$page.url.searchParams.get('id')) {
			goto('/fees');
			return;
		}
		const res = await fetch(`/api/fees/types/` + $page.url.searchParams.get('id'), {
			method: 'DELETE'
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 204) {
			toast.success('Usunięto!');
			goto('/fees', { invalidateAll: true });
		} else {
			toast.error('Wystąpił błąd! - ' + res);
			console.log('Error:', status, body);
		}
	};

	function closeDeleteDialog() {
		(document.getElementById('delete_fee_modal') as HTMLFormElement).close();
	}
</script>

<DetailsPage
	title="Edytuj składkę"
	descTitle="Szczegóły składki"
	desc="Wypełnij pola obowiązkowe"
	onSubmit={saveFeeType}
	cancelAction={() => goto(returnPath)}
	deleteAction={() => {
		document.getElementById('delete_fee_modal').showModal();
	}}
	formId="finance-form"
>
	<div class="md:col-span-5">
		<label for="name">Nazwa</label>
		<input
			type="text"
			name="name"
			id="name"
			value={data.fee_type?.name || ''}
			placeholder="Składka roczna RH2023/2024"
			minlength="3"
			required
		/>
	</div>
	<div class="md:col-span-1">
		<label for="amount">Kwota</label>
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">PLN</div>
			<input
				type="text"
				name="amount"
				id="amount"
				class="block pl-11"
				value={Math.abs(data.fee_type?.amount) || ''}
				placeholder="21,37"
			/>
		</div>
	</div>
	<div class="md:col-span-2">
		<label for="small_group">Kogo dotyczy</label>
		<select name="small_group" id="small_group">
			<option value="" selected={data.fee_type.fk_small_group_id === null}>Cała jednostka</option>
			{#each data.small_groups as small_group}
				<option
					value={small_group.id}
					selected={data.fee_type.fk_small_group_id === small_group.id}
				>
					{small_group.name}
				</option>
			{/each}
		</select>
	</div>
	<div class="md:col-span-2">
		<label for="date">Data początkowa</label>
		<input type="date" name="date" id="date" value={data.fee_type?.start_date || ''} required />
	</div>
	<div class="md:col-span-2">
		<label class="inline-flex items-center">
			Liczyć do finansów?
			<input
				type="checkbox"
				name="count_finance"
				id="count_finance"
				class="toggle toggle-primary ml-2"
				checked={data.fee_type?.count_finance || false}
			/>
		</label>
	</div>
	<div class="md:col-span-3">
		<label class="inline-flex items-center">
			Opłata okazjonalna
			<div class="ml-3" />
			<input
				type="checkbox"
				name="is_formal"
				id="is_formal"
				class="toggle toggle-primary"
				checked={data.fee_type?.is_formal || false}
			/>
			<div class="mr-3" />
			Składka roczna
		</label>
	</div>
</DetailsPage>

<dialog id="delete_fee_modal" class="modal">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-backdrop" on:click|stopPropagation={closeDeleteDialog} />
	<div class="border rounded-lg shadow relative max-w-2xl modal-box">
		<div class="flex justify-end p-2">
			<button
				type="button"
				class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
				on:click={closeDeleteDialog}
			>
				<svg
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>

		<div class="p-6 pt-0 text-center">
			<svg
				class="w-60 h-20 text-red-600 mx-auto"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<h2 class="mb-2 text-2xl font-semibold text-gray-700 dark:text-gray-200">
				Usuń {data.fee_type?.is_formal ? 'składkę' : 'opłatę'}
			</h2>
			<p class="text-xl font-semibold text-gray-700 dark:text-gray-200">
				Czy na pewno chcesz usunąć {data.fee_type?.is_formal ? 'składkę' : 'opłatę'}
				<b>{data.fee_type?.name}</b>?
			</p>
			<p class="text-gray-600 text-lg font-semibold dark:text-gray-400">Tego nie można cofnąć.</p>
			{#if data.fee_type?.count_finance}
				<p class="text-gray-600 text-lg font-semibold dark:text-gray-400">
					Usunięcie {data.fee_type?.is_formal ? 'składki' : 'opłaty'} nie wpłynie na wpisy finansowe.
				</p>
			{/if}
			<div class="flex justify-center mt-5">
				<button
					form="email-form"
					class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
					on:click={deleteFeeType}
				>
					Tak, usuń
				</button>
				<form method="dialog" on:submit={closeDeleteDialog}>
					<button
						class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2 text-center"
					>
						Nie, anuluj
					</button>
				</form>
			</div>
		</div>
	</div>
</dialog>
