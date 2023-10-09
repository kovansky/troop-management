import { json } from "@sveltejs/kit";

export async function DELETE({ params, locals: { supabase } }) {
    const person_id = params.id;
    if (!person_id) return json({ status: 300, body: 'Błąd wewnętrzny - żądanie jest puste' });
    const { error } = await supabase.from('people').delete().eq('id', parseInt(person_id)).select();
    if (error) return json({ status: 500, body: error });
    return json({ status: 204 });
}