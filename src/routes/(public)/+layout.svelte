<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	export let data: PageData;

    let { supabase } = data;
    $: ({ supabase } = data);
    const handleClick = async (event) => {
		const formData = new FormData(event.target);
		console.log(formData);
        const username = formData.get('username');
        const password = formData.get('password');
        console.log(username, password);
		toast.loading('Logowanie...');
        const {data, error} = await supabase.auth
			.signInWithPassword({
				email: username?.toString(),
				password: password?.toString(),
			});	
		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Zalogowano!');
			window.location.href = `${location.origin}/auth/cb`;
		}
    };
</script>

<div class="flex flex-col w-full h-screen gap-6">
	<div class="flex flex-col items-center justify-center w-full h-full">
		<h1 class="text-3xl font-bold mb-4">Login</h1>
		<form class="w-full max-w-sm" on:submit|preventDefault={handleClick}>
			<div class="mb-4">
				<label class="block text-gray-700 font-bold mb-2" for="username"> Adres E-Mail </label>
				<input
					class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="username"
					type="email"
					name="username"
					placeholder="Adres E-Mail"
					required
				/>
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 font-bold mb-2" for="password"> Hasło </label>
				<input
					class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="password"
					type="password"
					placeholder="Hasło"
					name="password"
					required
				/>
			</div>
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				type="submit"
			>
				Zaloguj się
			</button>
		</form>
	</div>
</div>
