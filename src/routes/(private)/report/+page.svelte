<script lang="ts">
	import { onMount } from 'svelte';
	import printPDF from './src/print';

	// async
	const handlePrint = async () => {
		// fetch /api/report
		const res = await fetch(`/api/report`).then((res) => res.json());
		console.log('res', res);

		let data = [];
		const body = res.body;
		for (let i = 0; i < body.length; i++) {
			console.log('body[i]', body[i]);
			data.push({
				date: body[i].date,
				name: body[i].name,
				category: body[i].finance_categories?.name || 'Brak kategorii',
				type: body[i].amount > 0 ? 'Przychód' : 'Wydatek',
				amount: body[i].amount
			});
		}
		console.log('data', data);

		const basePrintData = {
			addressSender: {
				person: 'André Kelling',
				street: 'Brückenstraße 3',
				city: '12439 Berlin',
				email: 'kontakt@andrekelling.de',
				phone: '+49 (0) 178 1 / 751 157'
			},
			address: {
				company: 'Johnlands',
				person: 'Jona Jonaldo',
				street: 'Jonestreet 123',
				city: '12345 Jenese Joplin'
			},
			personalInfo: {
				website: 'https://andrekelling.de',
				bank: {
					person: 'André Kelling',
					name: 'Noris Bank',
					IBAN: 'DE12 3456 7890 1234 5678 90'
				},
				taxoffice: {
					name: 'Stowarzyszenie Harcerskie, ul. Hoża 57, 00-681 Warszawa',
					number: 'mail: sh@sh.org.pl | www.sh.org.pl | tel.: 508 266 782',
					third_line:
						'NIP: 526 170 6256 | REGON: 011 918 353 | KRS: 000 0160 636 | nr rachunku bankowego: 84 1500 1777 1217 7001 1433 0000'
				}
			},
			label: {
				invoicenumber: 'Invoice No.',
				invoice: 'Invoice for',
				tableItems: 'Items',
				tableQty: 'Qty',
				tableSinglePrice: 'Price',
				tableSingleTotal: 'Total',
				totalGrand: 'Grand Total',
				contact: 'Kontaktdetails',
				bank: 'Bankverbindung',
				taxinfo: 'Steuernummer'
			}
		};
		const shortPrintData = {
			invoice: {
				number: '2018-15738',
				date: '28.06.2018',
				subject: 'https://andrekelling.de',
				total: '2.838,00 €',
				text: 'Etiam quis quam. Nullam at arcu a est sollicitudin euismod. Nulla quis diam. Etiam neque. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut\nal ex ea commodi consequatur? Fusce tellus. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Phasellus enim erat,\nvestibulum vel, aliquam a, posuere eu, velit. Integer vulputate sem a nibh rutrum consequat. Mauris metus. Phasellus faucibus molestie nisl. Suspendisse sagittis ultrices augue. Integer imperdiet lectus quis justo.'
			},
			items: data
		};

		printPDF(Object.assign(basePrintData, shortPrintData));
	};
</script>

<!-- button -->
<button class="btn btn-primary" on:click={handlePrint}>Print</button>
