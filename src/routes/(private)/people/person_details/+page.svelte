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
		const res = await fetch(`/api/people`, {
			method: 'POST',
			body: formData
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 200 || status === 201) {
			toast.success('Zapisano!');
			// invalidateAll();
			// window.location.replace('/people');
			goto(returnPath, { invalidateAll: true });
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};

	const deletePerson = async () => {
		if (!$page.url.searchParams.get('id')) {
			goto('/people');
			return;
		}
		const res = await fetch(`/api/people/` + $page.url.searchParams.get('id'), {
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
			<h2 class="font-semibold text-xl text-gray-600 pb-4">Edytuj dane harcerza</h2>

			<div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
				<div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
					<div class="text-gray-600">
						<p class="font-medium text-lg">Dane osobowe</p>
						<p>Wypełnij pola obowiązkowe</p>
					</div>

					{#await data.streamed.person}
						<div class="lg:col-span-2">
							<div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5 animate-pulse">
								<div class="md:col-span-5">
									<label for="full_name">Imię i nazwisko</label>
									<div class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
								</div>

								<div class="md:col-span-5">
									<label for="pesel">Numer PESEL</label>
									<div class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
								</div>

								<div class="md:col-span-3">
									<label for="address">Ulica i numer domu</label>
									<div class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
								</div>

								<div class="md:col-span-2">
									<label for="city">Miejscowość</label>
									<div class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
								</div>

								<div class="md:col-span-5">
									<label for="full_name">Imię i nazwisko rodzica</label>
									<div class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
								</div>

								<div class="md:col-span-3">
									<label for="email">Adres email rodzica</label>
									<div class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
								</div>

								<div class="md:col-span-2">
									<label for="phone">Numer telefonu rodzica</label>
									<div class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
								</div>
							</div>
							<!-- row -->
							<div class="inline-flex float-right pt-4">
								<div class="px-2">
									<div class="inline-flex">
										<button
											class="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
											>Usuń</button
										>
									</div>
								</div>

								<div class="px-2">
									<div class="inline-flex">
										<button
											class="bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
											>Anuluj</button
										>
									</div>
								</div>

								<div class="px-2">
									<div class="inline-flex items-end">
										<button
											class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
											>Zapisz</button
										>
									</div>
								</div>
							</div>
						</div>
					{:then person}
						<div class="lg:col-span-2">
							<div class="grid gap-2">
								<form
									on:submit|preventDefault={savePerson}
									id="person-form"
									class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5"
								>
									<div class="md:col-span-5">
										<label for="full_name">Imię i nazwisko</label>
										<input
											type="text"
											name="full_name"
											id="full_name"
											value={person?.name ? capitalizeEveryWord(person?.name) : ''}
											placeholder="Jan Kowalski"
											minlength="3"
											required
										/>
									</div>

									<div class="md:col-span-5">
										<label for="pesel">Numer PESEL</label>
										<input
											type="number"
											name="pesel"
											id="pesel"
											value={person?.pesel || ''}
											placeholder="12345678901"
											minlength="11"
											maxlength="11"
										/>
									</div>

									<div class="md:col-span-3">
										<label for="address">Ulica i numer domu</label>
										<input
											type="text"
											name="address"
											id="address"
											value={person?.address || ''}
											placeholder="Główna 1"
										/>
									</div>

									<div class="md:col-span-2">
										<label for="city">Miejscowość</label>
										<input
											type="text"
											name="city"
											id="city"
											value={person?.city || ''}
											placeholder="Gdańsk"
										/>
									</div>

									<div class="md:col-span-5">
										<label for="parent_name">Imię i nazwisko rodzica</label>
										<input
											type="text"
											name="parent_name"
											id="paren_name"
											value={person?.parent_name || ''}
											placeholder="Andrzej Kowalski"
										/>
									</div>

									<div class="md:col-span-3">
										<label for="email">Adres email rodzica</label>
										<input
											type="email"
											name="email"
											id="email"
											value={person?.email || ''}
											placeholder="jan.kowalski@example.com"
										/>
									</div>

									<div class="md:col-span-2">
										<label for="phone">Numer telefonu rodzica</label>
										<input
											type="tel"
											name="phone"
											id="phone"
											value={person?.phone || ''}
											placeholder="123456789"
										/>
									</div>
									<!-- Row -->
									<div class="md:col-span-2">
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
									</div>
									<div class="md:col-span-2">
										<label for="role">Funkcja</label>
										<select
											name="role"
											id="role"
											class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
										>
											{#each data.streamed.roles as role}
												<option value={role.id} selected={person?.fk_role_id === role.id}>
													{role.name}
												</option>
											{/each}
											<option value="" selected={!person?.fk_role_id}> Brak funkcji </option>
										</select>
									</div>
									<div class="md:col-span-1">
										<label for="degree">Stopień</label>
										<select
											name="degree"
											id="degree"
											class="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
										>
											{#each data.streamed.degrees as degree}
												<option value={degree.id} selected={person?.fk_degree_id === degree.id}>
													{degree.name}
												</option>
											{/each}
											<option value="" selected={!person?.fk_degree_id}> Brak stopnia </option>
										</select>
									</div>
								</form>
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
												form="person-form"
												type="submit"
												class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
												>Zapisz</button
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/await}
				</div>
			</div>
		</div>
	</div>
</div>
