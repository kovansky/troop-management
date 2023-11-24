<script lang="ts">
	export let deleteAction: () => void;
	export let submitAction: () => void;

	/** It might be placeholder e.g. during loading */
	export let ifPlaceholder: boolean;
</script>

<div class="flex w-3/4 mt-4 relative z-0">
	<div
		class="absolute rounded z-10 hover:bg-neutral-focus items-center flex-col gap-y-2 flex w-3/4 h-full opacity-0 hover:opacity-100 justify-center
        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:opacity-100"
	>
		<button class="bg-blue-500 hover:bg-blue-700" on:click={submitAction}>
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
		<button class="bg-red-500 hover:bg-red-700" on:click={deleteAction}>
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
