<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { capitalizeEveryWord } from '$lib/utils/text-utils';

	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	export let data: PageData;

	let returnPath = '/people';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('return')) {
			returnPath = urlParams.get('return');
		}
	});

	const savePerson = async (event) => {
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

	const deletePerson = async (event) => {
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
</script>

<div class="h-screen p-6 bg-gray-100 flex items-center justify-center">
	<div class="container max-w-screen-lg mx-auto">
		<div>
			<h2 class="font-semibold text-xl text-gray-600 pb-4">Edytuj wpis finansowy</h2>

			<div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
				<div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
					<div class="text-gray-600">
						<p class="font-medium text-lg">Szczegóły transakcji</p>
						<p>Wypełnij pola obowiązkowe</p>
					</div>
					<div class="lg:col-span-2">
						<form on:submit|preventDefault={savePerson}>
							<div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
								<div class="md:col-span-4">
									<label for="name">Nazwa</label>
									<input
										type="text"
										name="name"
										id="name"
										class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
										value={data.finance.name}
										placeholder="Chusty harcerskie"
										minlength="3"
										required
									/>
								</div>
                                <!-- kwota -->
                                <div class="md:col-span-1">

								<div class="md:col-span-5">
									<label for="address">Ulica i numer domu</label>
									<input
										type="text"
										name="address"
										id="address"
										class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
										value={data.finance.description}
										placeholder="Główna 1"
									/>
								</div>

								
								<!-- Row -->
								<!-- <div class="md:col-span-2">
									<label for="group">Zastęp</label>
									<select
										name="group"
										id="group"
										class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									>
										{#each data.streamed.groups as group}
											<option value={group.id} selected={person?.fk_small_group_id === group.id}>
												{group.name}
											</option>
										{/each}
										<option value="" selected={!person?.fk_small_group_id}> Brak zastępu </option>
									</select>
								</div> -->
							
								<!-- row -->
								<div class="inline-flex float-right pt-4">
									<div class="px-2">
										<div class="inline-flex">
											<!-- invoke delete -->
											<button
												on:click|preventDefault={deletePerson}
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
												class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
												>Zapisz</button
											>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
