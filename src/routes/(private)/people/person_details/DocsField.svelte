<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import toast from "svelte-french-toast";

    export let dataPresentBoolean: boolean;
    export let title: string;
    export let docType: string;

    const uploadDocument = async (event) => {
		const formData = new FormData();
		formData.append(docType, event.target.file.files[0]);
		if (!event.target.file.files[0]) {
			toast.error('Nie wybrano pliku!');
			return;
		}
		toast.loading('Wysyłanie dokumentu ...');
		const res = await fetch(`/api/people/` + $page.url.searchParams.get('id') + '/docs/' + docType,  {
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

    const deleteDocument = async () => {
        toast.loading('Usuwanie dokumentu...');
        const res = await fetch(`/api/people/` + $page.url.searchParams.get('id') + '/docs/' + docType, {
            method: 'DELETE'
        }).then((res) => res.json());
        const { status, body } = res;
        toast.dismiss();
        if (status === 204) {
            toast.success('Usunięto!');
			closeDeleteDialog();
            invalidateAll();
        } else if (status === 400) {
            toast.error('Błędne dane! - ' + body);
        } else {
            toast.error('Wystąpił błąd! - ' + body);
            console.log('Error:', status, body);
        }
    }

    const downloadDocument = async () => {
        toast.loading('Pobieranie dokumentu...');
        const res = await fetch(`/api/people/` + $page.url.searchParams.get('id') + '/docs/' + docType, {
            method: 'GET'
        }).then((res) => res.json());
        const { status, body } = res;
        toast.dismiss();
        if (status === 200) {
            toast.success('Pobrano dokument!');
			window.open(body);			
        } else if (status === 400) {
            toast.error('Błędne dane! - ' + body);
        } else {
            toast.error('Wystąpił błąd! - ' + body);
            console.log('Error:', status, body);
        }
    }

    function closeDialog() {
		(document.getElementById(`upload_docs_${docType}`) as HTMLFormElement).close();
	}

    function closeDeleteDialog() {
		(document.getElementById(`delete_docs_${docType}`) as HTMLFormElement).close();
	}
</script>

<style lang="postcss">
    .button-small {
        @apply ml-4 w-7 h-7 flex items-center;
    }
</style>

<div class="h-12 bg-gray-50 border rounded-lg flex items-center px-2 justify-between mb-2">
    <p>{title} - {dataPresentBoolean == true ? '✓' : 'X'}</p>
    <div class="flex">
        {#if dataPresentBoolean == true}
            <button title="Pobierz" class="button-small" on:click={downloadDocument}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g><g id="SVGRepo_iconCarrier">
                        <path
                            d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
                            stroke="#1C274C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                        <path
                            d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487"
                            stroke="#1C274C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </g></svg
                >
            </button>
            <button title="Usuń" class="button-small" on:click={() => document.getElementById(`delete_docs_${docType}`).showModal()}>
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
            </button>
        {/if}
        {#if dataPresentBoolean != true}
            <button title="Prześlij" class="button-small" on:click={() => {
				document.getElementById(`upload_docs_${docType}`).showModal();
			}}
            >
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
            </button>
        {/if}
    </div>
</div>

<dialog id="upload_docs_{docType}" class="modal">
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
				{title}
			</h2>
			<div class="mt-4">
				<form
					on:submit|preventDefault={uploadDocument}
					class="flex flex-col items-center"
				>
					<input
						name="file"
						type="file"
						class="file-input file-input-bordered w-full max-w-sm"
					/>                    
                    <div class="md:col-span-5">
						<button
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

<dialog id="delete_docs_{docType}" class="modal">
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
				{title}
			</h2>
			<!-- are you sure -->
			<p class="text-gray-600 dark:text-gray-400 mb-4">
				Czy na pewno chcesz usunąć ten dokument?
			</p>
			<div class="mt-4">
				<form
					on:submit|preventDefault={deleteDocument}
					class="flex flex-col items-center"
				>                
                    <div class="md:col-span-5">
						<button
							type="submit"
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-4"
							>Usuń</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</dialog>