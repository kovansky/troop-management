<script lang="ts">
	export let formId: string;
	export let deleteAction: () => void;
	export let cancelAction: () => void;
</script>

<div class="inline-flex float-right pt-4">
	<div class="px-2">
		<div class="inline-flex">
			<button on:click|preventDefault={deleteAction} class="bg-red-600 hover:bg-blue-700"
				>Usuń</button
			>
		</div>
	</div>
	<div class="px-2">
		<div class="inline-flex">
			<button on:click|preventDefault={cancelAction} class="bg-gray-600 hover:bg-blue-700"
				>Anuluj</button
			>
		</div>
	</div>
	<div class="px-2">
		<div class="inline-flex">
			<button type="submit" form={formId} class="bg-blue-500 hover:bg-blue-700">Zapisz</button>
		</div>
	</div>
</div>

<style lang="postcss">
	button {
		@apply text-white font-bold py-2 px-6 rounded;
	}
</style>
