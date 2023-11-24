export async function load({ locals: { supabase } }) {
	const { data: operations, error } = await supabase
		.from('finance_history')
		.select(`id, name, amount, finance_categories (name, color), fk_fee, date, invoice_number`)
		.order('date', { ascending: false });
	if (error) throw error;
	operations.forEach((operation) => {
		if (operation.fk_fee) {
			delete operation.id;
		}
	});
	return { operations };
}
