<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
</script>

<svelte:head>
	<title>Scout Manager</title>
	<meta name="description" content="System zarządzania jednostką" />
</svelte:head>

<Toaster />
<div class="h-full flex flex-col flex-grow">
	<slot />
</div>
