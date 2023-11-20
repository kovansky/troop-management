<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import TableView from '$lib/components/TableView.svelte';
	import MainPage from '$lib/components/MainPage.svelte';

	export let data: PageData;
</script>

<MainPage
	title="Lista składek i opłat"
	subtitle="Lista składek rocznych i okazjonalnych opłat w jednostce"
	gotoUrl="${$page.url}/fee_edit"
	buttonName="Dodaj składkę/opłatę"
>
	<TableView
		labelList={['Nazwa', 'Kogo dotyczy', 'Kwota', 'Liczone do finansów', 'Data początkowa']}
	>
		{#each data.fees_types as fee_type}
			<tr
				class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
				on:click={() => goto(`${$page.url}/fee_details?id=${fee_type.id}`)}
			>
				<td>
					<div class="flex items-center text-sm">
						<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
							<div class="w-0 h-0 rounded-full shadow-inner scale-50">
								<svg class="dark:fill-gray-300">
									<defs id="defs1328" />
									<path
										style="opacity:1;stroke:none;stroke-width:259.50698853;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
										d="M 31.1875 0 C 13.904525 0.43835438 3.7379722e-013 14.612004 0 32 C 2.3684758e-015 49.663996 14.336004 64 32 64 C 49.663996 64 64 49.663996 64 32 C 64 14.336004 49.663996 1.3812956e-013 32 0 C 31.724 3.7007434e-017 31.461833 -0.0069580061 31.1875 0 z M 31.15625 5.5 C 31.439783 5.4910103 31.714297 5.5 32 5.5 C 46.628003 5.4999998 58.5 17.371998 58.5 32 C 58.499998 46.628001 46.628002 58.5 32 58.5 C 17.371999 58.499999 5.5 46.628002 5.5 32 C 5.4999999 17.657701 16.922915 5.9512829 31.15625 5.5 z "
										id="path1334"
									/>
									<path
										style="font-size:53.81440353px;font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;text-align:start;line-height:100%;writing-mode:lr-tb;text-anchor:start;opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;font-family:Arial Narrow"
										d="M 25.645354,38.743144 C 27.706139,41.625309 33.995692,41.833441 36.155115,40.6114 C 36.947727,40.162852 37.145708,38.864507 37.145725,37.98432 C 37.145708,37.380283 36.986739,36.905677 36.668816,36.560499 C 36.333199,36.215341 35.479466,35.339232 34.490338,35.080346 C 29.473962,33.785975 25.998702,32.169274 24.638637,30.995688 C 22.942961,29.528736 22.669211,28.570622 22.669213,26.016357 C 22.669211,23.462132 23.403703,21.32133 25.064052,19.785304 C 26.724393,18.24933 29.135426,17.481331 32.297159,17.481304 C 35.317562,17.481331 39.565451,18.278588 41.636566,20.737131 L 38.183516,24.493331 C 36.236051,22.858359 34.787665,22.710631 32.403139,22.710609 C 30.901751,22.710631 30.120168,22.926362 29.484299,23.3578 C 28.848414,23.772024 28.530476,24.315664 28.530483,24.988721 C 28.530476,25.592786 28.821918,26.09328 29.404815,26.490205 C 29.987693,26.904426 31.511133,27.525729 34.549225,28.354116 C 37.958218,29.286087 40.272103,30.416513 41.490888,31.745396 C 42.691968,33.074309 43.292518,34.843296 43.292541,37.052364 C 43.292518,39.710168 42.356366,41.901988 40.484082,43.627827 C 38.629421,45.353671 36.346462,46.694998 33.061111,46.694997 C 28.832157,46.694996 23.187374,45.201054 21.630014,42.439699"
										id="text1367"
									/>
									<path
										style="opacity:1;stroke:none;stroke-width:259.50698853;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
										d="M 30.375,12.875 L 30.375,19.71875 L 33.625,19.71875 L 33.625,12.875 L 30.375,12.875 z M 30.375,44.96875 L 30.375,51.125 L 33.625,51.125 L 33.625,44.96875 L 30.375,44.96875 z "
										id="rect2278"
									/>
								</svg>
							</div>
						</div>
						<div>
							<p class="font-semibold">{fee_type?.name || 'Brak nazwy'}</p>
							<p class="text-xs text-gray-600 dark:text-gray-400">
								{fee_type.is_formal ? 'Składka roczna' : 'Opłata okazjonalna'}
							</p>
						</div>
					</div>
				</td>
				<td class="text-sm">{fee_type?.small_groups?.name || 'Cała jednostka'}</td>
				<td class="text-sm">{fee_type?.amount ? fee_type.amount + ' PLN' : 'Nie podano'}</td>
				<td class="w-1/6 text-sm">{fee_type?.count_finance ? 'Tak' : 'Nie'}</td>
				<td class="text-sm">{fee_type?.start_date || 'Błąd'}</td>
			</tr>
		{/each}
	</TableView>
</MainPage>
