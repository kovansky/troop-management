export async function load({ locals: { supabase } }) {
	const { data: fees_types, error: db_error1 } = await supabase
		.from('fees_types')
		.select(
			`
  id, name, amount, small_groups (name), count_finance, start_date, is_formal`
		)
		.order('start_date', { ascending: false });
	if (db_error1) throw db_error1;
	return { fees_types };
}
