<script lang="ts">
	import type { PageData } from './$types';

	import { capitalizeEveryWord } from '../../../lib/utils/text-utils';
	import ColorTag from '../../../lib/components/ColorTag.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { split } from 'postcss/lib/list';
	import MainPage from '$lib/components/MainPage.svelte';
	import TableView from '$lib/components/TableView.svelte';
	export let data: PageData;
</script>

<MainPage
	title="Ewidencja harcerzy"
	subtitle="Lista harcerzy należących do drużyny"
	gotoUrl="/people/person_details"
	buttonName="Dodaj harcerza"
>
	<TableView labelList={['Imię i Nazwisko', 'Funkcja', 'Zastęp główny', 'Stopień']}>
		{#each data.people as person}
			<tr
				class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
				on:click={() => goto(`${$page.url}/person_details?id=${person.id}`)}
			>
				<td>
					<div class="flex items-center text-sm">
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
										(picture) => person.id.toString() == picture.name.split('.')[0].toString()
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
				<td class="text-sm">{person.small_groups?.name || 'Brak zastępu'}</td>
				<ColorTag
					classes="pr-10"
					color={person.degrees?.color}
					title={person.degrees?.name ?? 'HBS'}
				/>
			</tr>
		{/each}
	</TableView>
</MainPage>
