<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { capitalizeEveryWord } from '$lib/utils/text-utils';

	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
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
		const url = $page.url.searchParams.get('id') ? `/api/fees/types/` + $page.url.searchParams.get('id') : `/api/fees/types/`;
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
</script>

<div class="h-screen p-6 bg-gray-100 flex items-center justify-center">
	<div class="container max-w-screen-lg mx-auto">
		<div>
			<h2 class="font-semibold text-xl text-gray-600 pb-4">Edytuj składkę</h2>

			<div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
				<div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
					<div class="text-gray-600">
						<p class="font-medium text-lg">Szczegóły składki</p>
						<p>Wypełnij pola obowiązkowe</p>
					</div>
					<div class="lg:col-span-2">
						<div class="grid gap-2">
							<form
								on:submit|preventDefault={saveFeeType}
								class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5"
								id="finance-form"
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
										<div
											class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
										>
											PLN
										</div>
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
									<select
										name="small_group"
										id="small_group"
										class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									>
										<option value="" selected={data.fee_type.fk_small_group_id === null}
											>Cała jednostka</option
										>
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
									<input
										type="date"
										name="date"
										id="date"
										value={data.fee_type?.start_date || ''}
										required
									/>
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
										<div class="ml-3"/>
										<input
											type="checkbox"
											name="is_formal"
											id="is_formal"
											class="toggle toggle-primary"
											checked={data.fee_type?.is_formal || false}>
											<div class="mr-3"/>
										Składka roczna
									</label>
								</div>
							</form>
							<div class="inline-flex float-right pt-4">
								<div class="px-2">
									<div class="inline-flex">
										<button
											on:click|preventDefault={deleteFeeType}
											class="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
											>Usuń</button
										>
									</div>
								</div>
								<div class="px-2">
									<div class="inline-flex">
										<button
											on:click|preventDefault={() => goto(returnPath)}
											class="bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
											>Anuluj</button
										>
									</div>
								</div>
								<div class="px-2">
									<div class="inline-flex">
										<button
											type="submit"
											form="finance-form"
											class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
											>Zapisz</button
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
