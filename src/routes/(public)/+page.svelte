<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	export let data: PageData;

	let { supabase } = data;
	$: ({ supabase } = data);
	const handleClick = async (event) => {
		const formData = new FormData(event.target);
		const username = formData.get('username');
		const password = formData.get('password');
		toast.loading('Logowanie...');
		const { data, error } = await supabase.auth.signInWithPassword({
			email: username?.toString(),
			password: password?.toString()
		});
		toast.dismiss();
		if (error) {
			console.log('Error:', error);
			toast.error(error.message);
		} else {
			toast.success('Zalogowano!');
			window.location.href = `${location.origin}/auth/cb`;
		}
	};

	const resetPassword = async (event) => {
		const form = new FormData(event.target);
		const email = form.get('email').toString();
		if (!email) {
			toast.error('Nie podano adresu email!');
			return;
		}
		toast.loading('Wysyłanie emaila z linkiem do resetu hasła...');
		const { error } = await supabase.auth.resetPasswordForEmail(email);
		toast.dismiss();
		if (error) {
			console.log('Error:', error);
			toast.error('Wystąpił błąd! - ' + error.message);
		} else {
			toast.success('Wysłano email z linkiem do resetu hasła!');
		}
	};
	const closeDialog = () => (document.getElementById('person_modal') as HTMLFormElement).close();
</script>

<div class="flex flex-col w-full h-screen gap-6">
	<div class="flex flex-col items-center justify-center w-full h-full">
		<h1 class="text-3xl font-bold mb-4 dark:text-gray-200">Login</h1>
		<form class="w-full max-w-sm" on:submit|preventDefault={handleClick}>
			<div class="mb-4">
				<label class="block text-gray-700 font-bold mb-2 dark:text-gray-200" for="username">
					Adres E-Mail
				</label>
				<input
					class="appearance-none border rounded w-full py-2 px-3 dark:text-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="username"
					type="email"
					name="username"
					placeholder="Adres E-Mail"
					required
				/>
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 font-bold mb-2 dark:text-gray-200" for="password">
					Hasło
				</label>
				<input
					class="appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
					id="password"
					type="password"
					placeholder="Hasło"
					name="password"
					required
				/>
			</div>
			<div class="flex items-center justify-between">
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Zaloguj się
				</button>
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
					on:click={() => document.getElementById('person_modal').showModal()}
				>
					Zapomniałeś hasła?
				</div>
			</div>
		</form>
	</div>
</div>

<dialog id="person_modal" class="modal">
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
				Zapomniane hasło?
			</h2>
			<p class="text-xl mb-3 font-semibold text-gray-700 dark:text-gray-200">
				Wprowadź adres email, na który zostało założone konto, a my wyślemy Ci link do zmiany hasła.
			</p>
			<form id="email-form" method="dialog" on:submit={resetPassword}>
				<label for="email">Adres email użytkownika</label>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="jan.kowalski@example.com"
					required
				/>
			</form>
			<div class="flex justify-center mt-5">
				<button
					form="email-form"
					class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2 text-center mr-2"
				>
					Wyślij link do zmiany hasła
				</button>
				<form method="dialog" on:submit={closeDialog}>
					<button
						class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2 text-center"
					>
						Anuluj
					</button>
				</form>
			</div>
		</div>
	</div>
</dialog>
