import { json } from '@sveltejs/kit';
import { general_delete, general_get, general_post } from '../general_docs.js';

export async function DELETE({ params, locals: { supabase } }) {
	const person_id = params.id;
	if (!person_id) return json({ status: 300, body: 'Błąd wewnętrzny - żądanie jest puste' });
    return json(await general_delete({ params, locals: { supabase }, type: 'agreement' }));
}

export async function POST({ request, params, locals: { supabase } }) {
    const person_id = params.id;
    if (!person_id) return json({ status: 300, body: 'Błąd wewnętrzny - żądanie jest puste' });
    return json(await general_post({ request, params, locals: { supabase }, type: 'agreement' }));
}

export async function GET({ params, locals: { supabase } }) {
    const person_id = params.id;
    if (!person_id) return json({ status: 300, body: 'Błąd wewnętrzny - żądanie jest puste' });
    return json(await general_get({ params, locals: { supabase }, type: 'agreement' }));
}