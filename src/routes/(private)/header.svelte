<script lang="ts">
	import { capitalizeEveryWord } from '$lib/utils/text-utils';
	export let data: any;
	export let withSearch = true;
</script>

<header class="z-10 py-4 bg-base-100 shadow-md">
	<div
		class="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300"
	>
		<!-- Mobile hamburger -->
		<button
			id="nav-mobile-hamburger"
			class="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
			on:click={toggleSideMenu}
			aria-label="Menu"
		>
			<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		{#if withSearch}
			<!-- Search input -->
			<div class="flex justify-center flex-1 lg:mr-32">
				<div class="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
					<div class="absolute inset-y-0 flex items-center pl-2">
						<svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<input
						class="w-full pl-8 pr-2 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
						type="text"
						placeholder="Search for Profiles (uid / email / username)"
						aria-label="Search"
					/>
				</div>
			</div>
		{/if}

		<div class:w-full={!withSearch}>
			<ul class="flex justify-end items-center flex-shrink-0 space-x-6">
				<!-- Theme toggler -->
				<li class="flex">
					<!-- toggle theme daisyUI button -->
					<div class="form-control w-52">
						<label class="cursor-pointer label">
							<span class="label-text">Remember me</span>
							<input
								type="checkbox"
								class="toggle toggle-primary"
								data-toggle-theme="dark,light"
								data-act-class="ACTIVECLASS"
							/>
						</label>
					</div>
				</li>
				<!-- row -->
				<div class="flex items-center justify-center">
					<!-- name and role below -->
					<div class="flex flex-col ml-2 mr-2 items-end">
						<div class="text-lg font-medium leading-none text-gray-600 dark:text-gray-300">
							{capitalizeEveryWord(data.user?.name || '')}
						</div>
						<div class="text-sm font-medium leading-none text-gray-600 dark:text-gray-300">
							{data.user?.roles.name || ''}
						</div>
					</div>
					<div class="avatar">
						<div class="rounded-full w-11 h-11 m-1">
							<svg
								fill={data.user?.roles.color || 'gray'}
								viewBox="0 0 32 32"
								id="icon"
								xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<defs>
										<style>
											.cls-1 {
												fill: none;
											}
										</style>
									</defs>
									<path
										id="_inner-path_"
										data-name="<inner-path>"
										class="cls-1"
										d="M8.0071,24.93A4.9958,4.9958,0,0,1,13,20h6a4.9959,4.9959,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0ZM20.5,12.5A4.5,4.5,0,1,1,16,8,4.5,4.5,0,0,1,20.5,12.5Z"
									/>
									<path
										d="M26.7489,24.93A13.9893,13.9893,0,1,0,2,16a13.899,13.899,0,0,0,3.2511,8.93l-.02.0166c.07.0845.15.1567.2222.2392.09.1036.1864.2.28.3008.28.3033.5674.5952.87.87.0915.0831.1864.1612.28.2417.32.2759.6484.5372.99.7813.0441.0312.0832.0693.1276.1006v-.0127a13.9011,13.9011,0,0,0,16,0V27.48c.0444-.0313.0835-.0694.1276-.1006.3412-.2441.67-.5054.99-.7813.0936-.08.1885-.1586.28-.2417.3025-.2749.59-.5668.87-.87.0933-.1006.1894-.1972.28-.3008.0719-.0825.1522-.1547.2222-.2392ZM16,8a4.5,4.5,0,1,1-4.5,4.5A4.5,4.5,0,0,1,16,8ZM8.0071,24.93A4.9957,4.9957,0,0,1,13,20h6a4.9958,4.9958,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0Z"
									/>
									<rect
										id="_Transparent_Rectangle_"
										data-name="<Transparent Rectangle>"
										class="cls-1"
										width="32"
										height="32"
									/>
								</g></svg
							>
						</div>
					</div>
				</div>
			</ul>
		</div>
	</div>
</header>
