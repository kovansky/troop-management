import { json } from '@sveltejs/kit';
import { handleTypes } from '../handleTypes';

export async function PUT({ request, params, locals: { supabase } }): Promise<Response> {
	const fee_type_id = params.id;

	const data = await handleTypes(request.formData());
	if ('status' in data) {
		return data;
	}

	const { data: fee, error } = await supabase
		.from('fees_types')
		.update(data)
		.eq('id', fee_type_id)
		.select();
	if (error) return json({ status: 500, body: error.message });
	return json({ status: 200, body: fee });
}

export async function DELETE({ params, locals: { supabase } }): Promise<Response> {
	const fee_type_id = params.id;
	const { error } = await supabase.from('fees_types').delete().eq('id', fee_type_id);
	if (error) return json({ status: 500, body: error.message });
	return json({ status: 204 });
}
