<script lang="ts">
	export let value: string;
	export let text: string;
	export let baseColor: string;
	export let textColor: string;
</script>

<div class="w-1/2 pr-4 pl-4 md:w-1/4">
	<div
		class="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 dark:border-gray-800 dark:bg-gray-700"
	>
		<div class="card-block md:p-5 p-3">
			<div class="flex flex-wrap items-center">
					<h4 class="{textColor} font-semibold text-2xl whitespace-nowrap">{value}</h4>
			</div>
		</div>
		<div class="py-3 md:px-6 px-3 border-t-1 border-gray-300 {baseColor}">
			<div class="flex flex-wrap items-center">
				<div class="w-3/4">
					<p class="text-white whitespace-nowrap">{text}</p>
				</div>
				<div class="w-1/4 text-right">
					<i class="feather icon-trending-up text-white f-16" />
				</div>
			</div>
		</div>
	</div>
</div>
