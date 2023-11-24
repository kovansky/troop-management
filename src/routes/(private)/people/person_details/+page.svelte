<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { capitalizeEveryWord, getFirstLetters } from '$lib/utils/text-utils';

	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import DetailsPage from '$lib/components/DetailsPage.svelte';
	import BigAvatar from './BigAvatar.svelte';
	import DocsField from './DocsField.svelte';
	export let data: PageData;

	let returnPath = '/people';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('return')) {
			returnPath = urlParams.get('return');
		}
		console.log(data);
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

	const deleteAvatar = async () => {
		if (!$page.url.searchParams.get('id')) {
			goto('/people');
			return;
		}
		toast.loading('Usuwanie profilowego...');
		const res = await fetch(`/api/people/` + $page.url.searchParams.get('id') + '/avatar', {
			method: 'DELETE'
		}).then((res) => res.json());
		const { status, body } = res;
		toast.dismiss();
		if (status === 204) {
			toast.success('Usunięto!');
			invalidateAll();
		} else {
			toast.error('Wystąpił błąd! - ' + res);
			console.log('Error:', status, body);
		}
	};

	const uploadAvatar = async (event) => {
		if (!$page.url.searchParams.get('id')) {
			goto('/people');
			return;
		}
		const formData = new FormData();
		formData.append('file_to_upload', event.target.file.files[0]);
		if (!event.target.file.files[0]) {
			toast.error('Nie wybrano pliku!');
			return;
		}
		toast.loading('Wysyłanie nowego profilowego...');
		const res = await fetch(`/api/people/` + $page.url.searchParams.get('id') + '/avatar', {
			method: 'POST',
			body: formData
		}).then((res) => res.json());
		const { status, body } = res;
		toast.dismiss();
		if (status === 200) {
			toast.success('Zapisano!');
			invalidateAll();
			closeDialog();
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};

	function closeDialog() {
		(document.getElementById('file_modal') as HTMLFormElement).close();
	}

	function closeDeleteDialog() {
		(document.getElementById('delete_person_modal') as HTMLFormElement).close();
	}

	const loadFile = function (event) {
		var output = document.getElementById('form-avatar') as HTMLFormElement;
		output.src = URL.createObjectURL(event.target.files[0]);
		output.onload = function () {
			URL.revokeObjectURL(output.src);
		};
	};
</script>

<DetailsPage
	title="Edytuj dane harcerza"
	descTitle="Dane osobowe"
	desc="Wypełnij pola obowiązkowe"
	formId="person-form"
	onSubmit={savePerson}
	cancelAction={() => goto(returnPath)}
	deleteAction={deletePerson}
>
	<div slot="avatar-slot">
		<BigAvatar
			deleteAction={deleteAvatar}
			submitAction={() => {
				document.getElementById('file_modal').showModal();
			}}
			ifPlaceholder={!(data.streamed.picture && data.streamed.picture !== '')}
		>
			{#if data.streamed.picture && data.streamed.picture !== ''}
				<img class="text-3xl" src={data.streamed.picture} alt="" />
			{:else}
				<span class="text-3xl">{getFirstLetters(data.streamed.person.name || 'Jan Kowalski')}</span>
			{/if}
		</BigAvatar>
		<p class="mt-5 font-medium text-lg text-gray-600 dark:text-gray-400 mb-2">Dokumenty:</p>
		<DocsField dataPresentBoolean={data.streamed.docs.declaration} title="Deklaracja członkowska" docType="declaration" />
		<DocsField dataPresentBoolean={data.streamed.docs.agreement} title="Zgoda na wizerunek" docType="agreement" />

		
	</div>

	<div class="md:col-span-5">
		<label for="full_name">Imię i nazwisko</label>
		<input
			type="text"
			name="full_name"
			id="full_name"
			value={data.streamed.person?.name ? capitalizeEveryWord(data.streamed.person?.name) : ''}
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
			value={data.streamed.person?.pesel || ''}
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
			value={data.streamed.person?.address || ''}
			placeholder="Główna 1"
		/>
	</div>

	<div class="md:col-span-2">
		<label for="city">Miejscowość</label>
		<input
			type="text"
			name="city"
			id="city"
			value={data.streamed.person?.city || ''}
			placeholder="Gdańsk"
		/>
	</div>

	<div class="md:col-span-5">
		<label for="parent_name">Imię i nazwisko rodzica</label>
		<input
			type="text"
			name="parent_name"
			id="paren_name"
			value={data.streamed.person?.parent_name || ''}
			placeholder="Andrzej Kowalski"
		/>
	</div>

	<div class="md:col-span-3">
		<label for="email">Adres email rodzica</label>
		<input
			type="email"
			name="parent_email"
			id="email"
			value={data.streamed.person?.parent_email || ''}
			placeholder="jan.kowalski@example.com"
		/>
	</div>

	<div class="md:col-span-2">
		<label for="phone">Numer telefonu rodzica</label>
		<input
			type="tel"
			name="parent_phone"
			id="phone"
			value={data.streamed.person?.parent_phone || ''}
			placeholder="123456789"
		/>
	</div>
	<div class="md:col-span-2">
		<label for="group">Zastęp</label>
		<select name="group" id="group">
			{#each data.streamed.groups as group}
				<option value={group.id} selected={data.streamed.person?.fk_small_group_id === group.id}>
					{group.name}
				</option>
			{/each}
			<option value="" selected={!data.streamed.person?.fk_small_group_id}> Brak zastępu </option>
		</select>
	</div>
	<div class="md:col-span-2">
		<label for="role">Funkcja</label>
		<select name="role" id="role">
			{#each data.streamed.roles as role}
				<option value={role.id} selected={data.streamed.person?.fk_role_id === role.id}>
					{role.name}
				</option>
			{/each}
			<option value="" selected={!data.streamed.person?.fk_role_id}> Brak funkcji </option>
		</select>
	</div>
	<div class="md:col-span-1">
		<label for="degree">Stopień</label>
		<select name="degree" id="degree">
			{#each data.streamed.degrees as degree}
				<option value={degree.id} selected={data.streamed.person?.fk_degree_id === degree.id}>
					{degree.name}
				</option>
			{/each}
			<option value="" selected={!data.streamed.person?.fk_degree_id}> Brak stopnia </option>
		</select>
	</div>
</DetailsPage>

<dialog id="file_modal" class="modal">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-backdrop" on:click|stopPropagation={closeDialog} />
	<div class="border rounded-lg shadow relative max-w-2xl modal-box">
		<div class="flex justify-end p-2">
			<button
				type="button"
				class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
				on:click={closeDialog}
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
				Zdjęcie profilowe harcerza
			</h2>
			<div class="mt-4">
				<form
					on:submit|preventDefault={uploadAvatar}
					id="avatar-form"
					class="flex flex-col items-center"
				>
					<input
						name="file"
						type="file"
						class="file-input file-input-bordered w-full max-w-xs"
						on:change={loadFile}
					/>
					<img id="form-avatar" class="mt-4 w-1/2" alt="" />
					<div class="md:col-span-5">
						<button
							form="avatar-form"
							type="submit"
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-4"
							>Zapisz</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</dialog>

<dialog id="delete_person_modal" class="modal">
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

		{#await data.streamed.person}
			Poczekaj, trwa ładowanie...
		{:then person}
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
				<h2 class="mb-2 text-2xl font-semibold text-gray-700 dark:text-gray-200">Usuń harcerza</h2>
				<p class="text-xl font-semibold text-gray-700 dark:text-gray-200">
					Czy na pewno chcesz usunąć harcerza <b>{capitalizeEveryWord(person?.name || '')}</b>?
				</p>
				<p class="text-gray-600 text-lg font-semibold dark:text-gray-400">Tego nie można cofnąć.</p>
				<div class="flex justify-center mt-5">
					<button
						form="email-form"
						class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
						on:click={deletePerson}
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
		{/await}
	</div>
</dialog>
