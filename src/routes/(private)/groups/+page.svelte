<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ColorTag from '$lib/components/ColorTag.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>


<svelte:head>
	<title>Ewidencja</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
	<div class="container grid px-6 mx-auto">
		
		<div class="flex justify-between items-center">
			<div>
				<h2 class="mt-6 mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">Lista grup i zastępów</h2>
				<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
					Lista zastępów i grup nieformalnych w jednostce
				</h4>
			</div>
			<button class="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:bg-green-500"
				on:click={() => goto(`${$page.url}/group_details`)}>
				Dodaj grupę/zastęp
			</button>
		</div>
		<div class="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
			<div class="w-full overflow-x-auto">
				<table class="w-full whitespace-no-wrap">
					<thead>
						<tr
							class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
						>
							<th class="px-4 py-3">Nazwa</th>
							<th class="px-4 py-3">Opis</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
						{#each data.groups as group}
							<tr class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 cursor-pointer" on:click={() =>goto(`${$page.url}/group_details?id=${group.id}`)}>
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
											<p class="font-semibold">{group?.name || 'Brak nazwy'}</p>
											<p class="text-xs text-gray-600 dark:text-gray-400">{group.is_formal ? 'Zastęp' : 'Grupa nieformalna'}</p>
										</div>
									</div>
								</td>
								<td class="px-4 py-3 text-sm">{group?.description || 'Brak opisu'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</main>
