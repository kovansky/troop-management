<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import toast from "svelte-french-toast";

	/** It might be placeholder e.g. during loading */
	export let ifPlaceholder: boolean;

	const deleteAvatar = async () => {
		if (!$page.url.searchParams.get('id')) {
			closeDialog();
			toast.error('Musisz najpierw zapisać harcerza!');
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
			closeDialog();
			toast.error('Musisz najpierw zapisać harcerza!');
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

	const loadFile = function (event) {
		var output = document.getElementById('form-avatar') as HTMLFormElement;
		output.src = URL.createObjectURL(event.target.files[0]);
		output.onload = function () {
			URL.revokeObjectURL(output.src);
		};
	};
	
	function closeDialog() {
		(document.getElementById('file_modal') as HTMLFormElement).close();
	}

</script>

<div class="flex w-3/4 mt-4 relative z-0">
	<div
		class="absolute rounded z-10 hover:bg-neutral-focus items-center flex-col gap-y-2 flex w-3/4 h-full opacity-0 hover:opacity-100 justify-center
        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:opacity-100"
	>
		<button class="bg-blue-500 hover:bg-blue-700" on:click={() => {
			document.getElementById('file_modal').showModal();
		}}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
				/>
			</svg>
			Prześlij
		</button>
		<button class="bg-red-500 hover:bg-red-700" on:click={deleteAvatar}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
				/>
			</svg>
			Usuń
		</button>
	</div>
	<div class="avatar {!ifPlaceholder ? '' : 'placeholder'} w-3/4 z-0">
		<div class="bg-neutral-content text-center text-neutral-focus rounded w-full">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss">
	button {
		@apply text-white font-bold py-2 px-4 rounded flex;
	}
	svg {
		@apply w-6 h-6 mr-1;
	}
</style>


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
