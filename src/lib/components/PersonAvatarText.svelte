<script lang="ts">
	import { capitalizeEveryWord } from '$lib/utils/text-utils';

	export let picturesPromise: Promise<any>;
	export let person: any;
</script>

<td>
	<div class="flex items-center text-sm">
		<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
			{#await picturesPromise}
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
			<p class="font-semibold">
				{capitalizeEveryWord(person?.name || 'Błąd')}
			</p>
			<p class="text-xs text-gray-600 dark:text-gray-400">
				{person?.join_year || ''}
			</p>
		</div>
	</div>
</td>
