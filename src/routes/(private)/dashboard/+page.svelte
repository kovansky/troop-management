<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
	import { goto } from '$app/navigation';
    
    export let data: PageData;

    onMount(() => {
        goto('/people');
    });
</script>