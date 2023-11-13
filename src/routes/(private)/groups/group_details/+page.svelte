<script lang="ts">
	import type { PageData } from './$types';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import ColorTag from '$lib/components/ColorTag.svelte';
	import { capitalizeEveryWord } from '$lib/utils/text-utils';
	export let data: PageData;

	let selected = [];

	onMount(() => {
		selected = data.group_person ? data.group_person.map((group_p) => group_p.fk_person_id) : [];
	});

	const handleCheck = (id) => {
		if (selected.indexOf(id) === -1) {
			selected = [...selected, id];
		} else {
			selected.splice(selected.indexOf(id), 1);
			selected = [...selected];
		}
	};

	const existingGroup = async (formData) => {
		const res = await fetch(`/api/groups/` + $page.url.searchParams.get('id'), {
			method: 'PUT',
			body: formData
		}).then((res) => res.json());
		return res;
	};
	const newGroup = async (formData) => {
		const res = await fetch(`/api/groups`, {
			method: 'POST',
			body: formData
		}).then((res) => res.json());
		return res;
	};

	const saveGroup = async (event) => {
		const formData = new FormData(event.target);
		formData.append('id', $page.url.searchParams.get('id'));
		for (let i = 0; i < selected.length; i++) {
			formData.append('people', selected[i].toString());
		}

		const { status, body } = await ($page.url.searchParams.get('id')
			? existingGroup(formData)
			: newGroup(formData));
		if (status === 200 || status === 201) {
			toast.success('Zapisano!');
			goto('/groups', { invalidateAll: true });
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};

	const deleteGroup = async () => {
		if (!$page.url.searchParams.get('id')) {
			goto('/groups');
			return;
		}
		const res = await fetch(`/api/groups/` + $page.url.searchParams.get('id'), {
			method: 'DELETE'
		}).then((res) => res.json());
		const { status, body } = res;
		if (status === 204) {
			toast.success('Usunięto!');
			goto('/groups', { invalidateAll: true });
		} else {
			toast.error('Wystąpił błąd! - ' + res);
			console.log('Error:', status, body);
		}
	};
</script>

<svelte:head>
	<title>Edycja grupy</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
	<div class="container grid px-6 mx-auto">
		<h2 class="mt-6 mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">Edycja grupy</h2>
		<form id="group-form" on:submit|preventDefault={saveGroup}>
			<div class="grid gap-4 gap-y-2 mb-4 text-sm grid-cols-1 md:grid-cols-5">
				<div class="md:col-span-2">
					<label for="name">Nazwa grupy</label>
					<input
						type="text"
						name="name"
						id="name"
						value={data.group?.name || ''}
						placeholder="Dym"
						minlength="3"
						required
					/>
				</div>

				<div class="md:col-span-3">
					<label for="desc">Opis</label>
					<input
						type="text"
						name="desc"
						id="desc"
						value={data.group?.description || ''}
						placeholder="Zastęp z naboru RH2022/23"
					/>
				</div>
				<div class="md:col-span-2">
					<label class="inline-flex items-center">
						Grupa
						<div class="ml-3"/>
						<input
							type="checkbox"
							name="is_formal"
							id="is_formal"
							class="toggle toggle-primary"
							checked={data.group?.is_formal || false}>
							<div class="mr-3"/>
						Zastęp
					</label>
				</div>
							
			</div>
		</form>

		<div class="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
			<div class="w-full overflow-x-auto">
				<table class="w-full whitespace-no-wrap">
					<thead>
						<tr
							class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
						>
							<th class="px-4 py-3">Zaznaczone</th>
							<th class="px-4 py-3">Imię i Nazwisko</th>
							<th class="px-4 py-3">Funkcja</th>
							<th class="px-4 py-3">Zastęp główny</th>
							<th class="px-4 py-3">Stopień</th>
							<th class="px-4 py-3">Akcja</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
						{#each data.people as person}
							<tr
								class="text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-100 cursor-pointer"
								on:click={() => handleCheck(person.id)}
							>
								<!-- checkbox daisyui -->
								<td class="px-4 py-3">
									<input
										type="checkbox"
										checked={selected.indexOf(person.id) !== -1}
										class="checkbox checkbox-primary"
										on:click|preventDefault={() =>
											selected.indexOf(person.id) === -1
												? selected.push(person.id)
												: selected.splice(selected.indexOf(person.id), 1)}
									/>
								</td>

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
											<p class="font-semibold">{capitalizeEveryWord(person.name)}</p>
											<p class="text-xs text-gray-600 dark:text-gray-400">{person.join_year || ''}</p>
										</div>
									</div>
								</td>
								<ColorTag color={person.roles?.color} title={person.roles?.name} />
								<td class="px-4 py-3 text-sm">{person.small_groups?.name || 'Brak zastępu'}</td>
								<ColorTag
									classes="pr-10"
									color={person.degrees?.color}
									title={person.degrees?.name ?? 'HBS'}
								/>
								<td class="px-4 py-3 flex items-center space-x-4 text-sm">
									<button
										class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
										aria-label="Edit"
										on:click|stopPropagation={() => goto('/people/person_details?id=' + person.id+'&return='+$page.url.pathname + $page.url.search)}
									>
										<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
											<path
												d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
											/>
										</svg>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="inline-flex float-right pt-4">
					<div class="px-2">
						<div class="inline-flex">
							<!-- invoke delete -->
							<button
								class="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
								on:click|preventDefault={deleteGroup}>Usuń</button
							>
						</div>
					</div>

					<div class="px-2">
						<div class="inline-flex">
							<button
								on:click|preventDefault={() => goto('/groups')}
								class="bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
								>Anuluj</button
							>
						</div>
					</div>

					<div class="px-2">
						<div class="inline-flex">
							<button
								type="submit"
								form="group-form"
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
								>Zapisz</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
