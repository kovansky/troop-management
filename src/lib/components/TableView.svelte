<script lang="ts">
	export let labelList: string[];
</script>

<div class="w-full overflow-x-auto overflow-y-hidden">
	<table class="w-full whitespace-no-wrap table-auto">
		<thead>
			<tr class="tr-header">
				{#each labelList as label}
					<th>{label}</th>
				{/each}
			</tr>
		</thead>
		<tbody class="tr-content">
			<slot />
		</tbody>
	</table>
</div>
