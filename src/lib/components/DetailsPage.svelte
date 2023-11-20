<script lang="ts">
	import ActionButtons from './ActionButtons.svelte';

	/** Title of page */
	export let title: string;
	/** Short label of the type of described object */
	export let descTitle: string;
	/** Description of the object */
	export let desc: string;

	/** Unique ID of form - it will be used to submit form. */
	export let formId: string;
	export let onSubmit: (event: Event) => void;
	/** Function that will be called when user clicks on cancel button. */
	export let cancelAction: () => void;
	/** Function that will be called when user clicks on delete button. */
	export let deleteAction: () => void;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="h-screen p-6 bg-gray-100 flex items-center justify-center dark:bg-gray-900">
	<div class="container max-w-screen-lg mx-auto">
		<div>
			<h2 class="font-semibold text-xl text-gray-600 pb-4 dark:text-gray-300">{title}</h2>
			<div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 dark:bg-gray-800">
				<div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
					<div>
						<div class="text-gray-600 dark:text-gray-400">
							<p class="font-medium text-lg">{descTitle}</p>
							<p>{desc}</p>
						</div>
						<slot name="avatar-slot" />
					</div>
					<div class="lg:col-span-2">
						<div class="grid gap-2">
							<form
								on:submit|preventDefault={onSubmit}
								class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5"
								id={formId}
							>
								<slot />
							</form>
							<ActionButtons {deleteAction} {cancelAction} {formId} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
