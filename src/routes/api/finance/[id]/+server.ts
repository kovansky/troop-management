import { json } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase } }) {
	const finance_id = params.id;
	if (!finance_id) return json({ status: 300, body: 'Błąd wewnętrzny - żądanie jest puste' });
	const { error } = await supabase
		.from('finance_history')
		.delete()
		.eq('id', parseInt(finance_id))
		.select();
	if (error) return json({ status: 500, body: error });
	return json({ status: 204 });
}
