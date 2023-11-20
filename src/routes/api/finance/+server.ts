import { json } from '@sveltejs/kit';

async function updateInsertFinanceHistory(body, { locals: { supabase, getSession } }) {
	const session = await getSession();
	if (!session?.user)
		return json({ status: 401, body: 'Użytkownik niezalogowany - odśwież sesję' });
	//TODO: it's ugly, refactor it
	//TODO: Implement handle of 401

	const data = {
		id: body.id || undefined,
		name: body.name,
		amount: body.amount,
		type: body.type,
		fk_category_id: body.category,
		invoice_number: body.doc_number,
		date: body.date,
		created_at: undefined
	};
	if (!body.id) {
		console.log('inserting');
		const { data: finance, error: db_error } = await supabase
			.from('finance_history')
			.insert(data)
			.select();
		if (db_error) return json({ status: 500, body: db_error });
		console.log(db_error);
		return json({ status: 201, body: finance });
	} else {
		console.log('updating');
		const { data: finance, error: db_error } = await supabase
			.from('finance_history')
			.upsert(data)
			.select();
		if (db_error) return json({ status: 500, body: db_error });
		return json({ status: 200, body: finance });
	}
}

export async function POST({ request, locals }): Promise<{ status: number; body }> {
	const formData = await request.formData();
	const finance_id = formData.get('id');

	const body = Object.fromEntries(formData.entries());
	if (!body) return json({ status: 400, body: 'Błąd wewnętrzny - żądanie jest puste' });

	let amount = parseFloat(body.amount.toString().replace(',', '.'));
	if (body.type == 'income') {
		amount = Math.abs(amount);
	} else {
		amount = -Math.abs(amount);
	}
	const newBody = {
		id: finance_id ? parseInt(finance_id.toString()) : null,
		name: body.name,
		amount: amount,
		category: parseInt(body.category.toString()),
		doc_number: body.doc_number,
		date: body.date
	};
	return await updateInsertFinanceHistory(newBody, { locals });
}
