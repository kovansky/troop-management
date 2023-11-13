<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	export let data: PageData;

	onMount(() => {
		const params = new URLSearchParams(window.location.hash);
		if ((params.get('#access_token') && params.get('#refresh_token')) || !params.get('#token')) {
			toast.error('Brak tokenów!');
			goto('/');
		}
	});

	const handleClick = async (event) => {
		const formData = new FormData(event.target);
		const params = new URLSearchParams(window.location.hash);
		formData.append('access_token', params.get('#access_token'));
		formData.append('refresh_token', params.get('#refresh_token'));
		formData.append('token', params.get('#token'));
		if (formData.get('password') !== formData.get('password1')) {
			toast.error('Hasła nie są takie same!');
			return;
		}
		toast.loading('Zmienianie hasła...');
		const res = await fetch(`/api/auth/change_password`, {
			method: 'POST',
			body: formData
		}).then((res) => res.json());
		const { status, body } = res;
		toast.dismiss();
		if (status === 200) {
			toast.success('Hasło zmienione!');
			goto('/');
		} else if (status === 400) {
			toast.error('Błędne dane! - ' + body);
		} else {
			toast.error('Wystąpił błąd! - ' + body);
			console.log('Error:', status, body);
		}
	};
</script>

<div class="flex flex-col w-full h-screen gap-6">
	<div class="flex flex-col items-center justify-center w-full h-full">
		<h1 class="text-3xl font-bold mb-4">Witaj!</h1>
		<form class="w-full max-w-sm" on:submit|preventDefault={handleClick} id="clickForm">
			<div class="mb-6">
				<div class="md:col-span-3">
					<label class="block text-gray-700 font-bold mb-2" for="password"> Wprowadź hasło </label>
					<input
						type="password"
						name="password"
						id="password"
						value=""
						placeholder="Wprowadź hasło"
						required
					/>
				</div>
			</div>
			<div class="md:col-span-3">
				<label class="block text-gray-700 font-bold mb-2" for="password"> Wprowadź hasło </label>
				<input
					type="password"
					name="password1"
					id="password1"
					value=""
					placeholder="Wprowadź hasło ponownie"
					required
				/>
			</div>
			<button
				class="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				type="submit"
				form="clickForm"
			>
				Ustaw hasło
			</button>
		</form>
	</div>
</div>
