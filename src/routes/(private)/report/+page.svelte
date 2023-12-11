<script lang="ts">
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import logo from '$lib/assets/logo.png';

	let finance_records = [];
	let loaded = false;
	let teamMoney;

	export let data;

	async function loadFinanceList() {
		toast.loading('Ładowanie listy finansów');
		const res = await fetch(`/api/report`).then((res) => res.json());

		const body = res.body.operations;
		teamMoney = res.body.team_money;
		const temp_data = [];
		for (let i = 0; i < body.length; i++) {
			temp_data.push({
				date: body[i].date,
				name: body[i].name,
				category: body[i].finance_categories?.name || 'Brak kategorii',
				type: body[i].amount > 0 ? 'Przychód' : 'Wydatek',
				amount: Math.abs(body[i].amount).toFixed(2).toString()
			});
		}
		finance_records = temp_data;
		toast.dismiss();
		toast.success('Raport finansowy został wygenerowany');
		loaded = true;
	}

	function printDiv() {
		document.getElementById('body').style.visibility = 'hidden';
		toast.remove();
		setTimeout(() => {
			window.print();
			document.getElementById('body').style.visibility = 'visible';
		}, 50);
	}

	onMount(() => {
		loadFinanceList();
	});
</script>

<main class="main-normal w-full flex flex-col">
	<button
		class="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
		on:click={printDiv}>Zapisz</button
	>
	{#if loaded == true}
		<div class="self-center w-[210mm] bg-white flex flex-col items-center pb-40" id="html_report">
			<div class="w-9/10 flex flex-col">
				<img src={data.team_logo_url} alt="" class="p-8 w-[45mm] self-center" />
				<div class="flex justify-between">
					<p class="text-xl font-medium self-start">Raport finansowy</p>
					<p class="text-xl font-light self-end">Wygenerowano {new Date().toLocaleDateString()}</p>
				</div>
				<p class="text-xl font-light self-start">
					{data.team_name}
				</p>
				<div class="flex-grow border-t border-green-400 mt-5" />
				<table class="w-full">
					<thead>
						<tr>
							<th class="text-left">Data</th>
							<th class="text-left">Nazwa</th>
							<th class="text-left">Kategoria</th>
							<th class="text-left">Rodzaj</th>
							<th class="text-right">Kwota [PLN]</th>
						</tr>
					</thead>
					<tbody>
						{#each finance_records as finance}
							<tr>
								<td class="text-left">{finance.date}</td>
								<td class="text-left">{finance.name}</td>
								<td class="text-left">{finance.category}</td>
								<td class="text-left">{finance.type}</td>
								<td class="text-right">{finance.amount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="mt-2" id="foot" />
				<hr class="h-0.5 bg-green-400" />
				<div class="flex justify-between mt-2">
					<p class="text-xl font-normal w-full text-end">
						Aktualny budżet: &emsp; <span
							class="font-semibold decoration-double underline underline-offset-4 decoration-2 decoration-green-400"
							>{teamMoney} PLN</span
						>
					</p>
				</div>
			</div>
		</div>
	{/if}
</main>

<style lang="postcss">
	th {
		@apply font-normal;
	}
	td {
		@apply font-light;
	}

	@media print {
		#html_report {
			width: 100%;
			visibility: visible;
			position: absolute;
			left: 0;
			top: 0;
			margin-top: 0;
		}

		@page {
			size: A4;
			margin: 0;
		}

		#foot {
			page-break-after: always;
			margin-top: 29mm;
		}
	}
</style>
