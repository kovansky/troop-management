<script lang="ts">
	import { onMount } from 'svelte';
	import * as html2pdf from 'html2pdf.js';
	import toast from 'svelte-french-toast';
	import logo from '$lib/assets/logo.png';

	let data = [];
	let loaded = false;
	let teamMoney;

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
		data = temp_data;
		toast.dismiss();
		toast.success('Raport finansowy został wygenerowany');
		loaded = true;
	}

	async function printPdf() {
		const element = document.getElementById('html_report');
		var opt = {
			image: { type: 'jpg', quality: 0.98 },
			filename: `raport_finansowy-${new Date().toLocaleDateString().replaceAll('.', '_')}.pdf`,
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
			html2canvas: { useCORS: true }
		};

		html2pdf().set(opt).from(element).save();
	}

	onMount(() => {
		loadFinanceList();
	});
</script>

<main class="main-normal w-full flex flex-col">
	<button
		class="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
		on:click={printPdf}>Zapisz</button
	>
	{#if loaded == true}
		<div class="self-center w-[210mm] bg-white flex flex-col items-center pb-40" id="html_report">
			<div class="w-4/5 flex flex-col">
				<img src={logo} alt="" class="w-[45mm] self-center" />
				<div class="flex justify-between">
					<p class="text-xl font-medium self-start">Raport finansowy</p>
					<p class="text-xl font-light self-end">Wygenerowano {new Date().toLocaleDateString()}</p>
				</div>
				<p class="text-xl font-light self-start">
					264 Chotomowska Drużyna Harcerzy <br /> "Żagiew" im. Stefana Krasińskiego
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
						{#each data as finance}
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
				<div class="flex-grow border-t border-green-400 mt-5" />
				<p class="text-xl font-normal self-end mt-5 pb-5">
					Aktualny budżet: &emsp; <span
						class="font-semibold decoration-double underline underline-offset-4 decoration-2 decoration-green-400"
						>{teamMoney} PLN</span
					>
				</p>
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
</style>
