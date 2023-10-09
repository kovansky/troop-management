<script lang="ts">
	export let title: string | undefined;
	export let color: string | undefined;
	export let classes: string = '';
</script>

<td class="px-4 py-3 text-xs {classes}">
	<span style="background-color: {color || 'grey'};"
	  class="px-2 py-1 font-semibold leading-tight text-white } rounded-full dark:bg-green-700 dark:text-green-100"
	>{title || 'Brak'}</span>
  </td>
