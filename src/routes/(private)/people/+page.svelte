<script lang="ts">
	import type { PageData } from './$types';

	import { capitalizeEveryWord } from '../../../lib/utils/text-utils';
	import ColorTag from '../../../lib/components/ColorTag.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { split } from 'postcss/lib/list';
	export let data: PageData;
</script>

<svelte:head>
	<title>Ewidencja</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
	<div class="container grid px-6 mx-auto">
		<div class="flex justify-between items-center">
			<div>
				<h2 class="mt-6 mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
					Ewidencja harcerzy
				</h2>
				<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
					Lista harcerzy należących do drużyny
				</h4>
			</div>
			<button
				class="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:bg-green-500"
				on:click={() => goto(`${$page.url}/person_details`)}
			>
				Dodaj harcerza
			</button>
		</div>
		<div class="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
			<div class="w-full overflow-x-auto">
				<table class="w-full whitespace-no-wrap">
					<thead>
						<tr
							class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
						>
							<th class="px-4 py-3">Imię i Nazwisko</th>
							<th class="px-4 py-3">Funkcja</th>
							<th class="px-4 py-3">Zastęp główny</th>
							<th class="px-4 py-3">Stopień</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
						{#each data.people as person}
							<tr
								class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
								on:click={() => goto(`${$page.url}/person_details?id=${person.id}`)}
							>
								<td class="px-4 py-3">
									<div class="flex items-center text-sm">
										<!-- Avatar with inset shadow -->
										<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
											{#await data.streamed.picturesList}
												<img
													class="object-cover w-full h-full rounded-full"
													src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
													alt=""
													loading="lazy"
												/>
											{:then picturesList}
												<img
													class="object-cover w-full h-full rounded-full"
													src={picturesList.find(
														(picture) =>
															person.id.toString() == picture.name.split('.')[0].toString()
													)?.url?.signedUrl ||
														'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'}
													alt=""
													loading="lazy"
												/>
											{/await}
											<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
										</div>
										<div>
											<p class="font-semibold">{capitalizeEveryWord(person.name)}</p>
											<p class="text-xs text-gray-600 dark:text-gray-400">
												{person.join_year || ''}
											</p>
										</div>
									</div>
								</td>
								<ColorTag color={person.roles?.color} title={person.roles?.name} />
								<td class="px-4 py-3 text-sm">{person.small_groups?.name || 'Brak zastępu'}</td>
								<ColorTag
									classes="pr-10"
									color={person.degrees?.color}
									title={person.degrees?.name ?? 'HBS'}
								/>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</main>
