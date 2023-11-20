<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import DetailsPage from '$lib/components/DetailsPage.svelte';
	export let data: PageData;

	let returnPath = '/finance';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('return')) {
			returnPath = urlParams.get('return');
		}
	});

	const saveOperation = async (event) => {
		const formData = new FormData(event.target);
		formData.append('id', $page.url.searchParams.get('id'));
		const res = await fetch(`/api/finance`, {
			method: 'POST',
			body: formData
		}).then((res) => res.json());
		const { status, body } = res;
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

	const deleteOperation = async (event) => {
		if (!$page.url.searchParams.get('id')) {
			goto('/finance');
			return;
		}
		const res = await fetch(`/api/finance/` + $page.url.searchParams.get('id'), {
			method: 'DELETE'
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 204) {
			toast.success('Usunięto!');
			goto(returnPath, { invalidateAll: true });
		} else {
			toast.error('Wystąpił błąd! - ' + res);
			console.log('Error:', status, body);
		}
	};

	function closeDeleteDialog() {
		(document.getElementById('delete_operation_modal') as HTMLFormElement).close();
	}
</script>

<DetailsPage
	title="Edytuj wpis finansowy"
	descTitle="Szczegóły transakcji"
	desc="Wypełnij pola obowiązkowe"
	formId="finance-form"
	onSubmit={saveOperation}
	deleteAction={() => {
		document.getElementById('delete_operation_modal').showModal();
	}}
	cancelAction={() => goto(returnPath)}
>
	<div class="md:col-span-5">
		<label for="name">Nazwa</label>
		<input
			type="text"
			name="name"
			id="name"
			value={data.finance?.name || ''}
			placeholder="Chusty harcerskie"
			minlength="3"
			required
		/>
	</div>
	<div class="md:col-span-2">
		<label for="amount">Kwota</label>
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">PLN</div>
			<input
				type="text"
				name="amount"
				id="amount"
				class="block pl-11"
				value={Math.abs(data.finance?.amount).toFixed(2) || ''}
				placeholder="21,37"
			/>
		</div>
	</div>
	<div class="md:col-span-1">
		<label for="type">Rodzaj transakcji</label>
		<select name="type" id="type">
			<option value="expense" selected={data.finance.amount < 0}>Wydatek</option>
			<option value="income" selected={data.finance.amount > 0}>Przychód</option>
		</select>
	</div>
	<div class="md:col-span-2">
		<label for="category">Kategoria</label>
		<select name="category" id="category">
			<option value="" selected={data.finance.fk_finance_category_id === null}>Brak</option>
			{#each data.categories as category}
				<option value={category.id} selected={data.finance.fk_category_id === category.id}>
					{category.name}
				</option>
			{/each}
		</select>
	</div>
	<div class="md:col-span-3">
		<label for="doc_number">Numer dokumentu</label>
		<input
			type="text"
			name="doc_number"
			id="doc_number"
			value={data.finance?.invoice_number || ''}
			placeholder="FV 123/2021"
		/>
	</div>
	<div class="md:col-span-2">
		<label for="date">Data</label>
		<input type="date" name="date" id="date" value={data.finance?.date || ''} required />
	</div>
</DetailsPage>

<dialog id="delete_operation_modal" class="modal">
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
			<h2 class="mb-2 text-2xl font-semibold text-gray-700 dark:text-gray-200">Usuń transakcję</h2>
			<p class="text-xl font-semibold text-gray-700 dark:text-gray-200">
				Czy na pewno chcesz usunąć transakcję <b>{data.finance?.name}</b>?
			</p>
			<p class="text-gray-600 text-lg font-semibold dark:text-gray-400">Tego nie można cofnąć.</p>
			<div class="flex justify-center mt-5">
				<button
					form="email-form"
					class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
					on:click={deleteOperation}
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
