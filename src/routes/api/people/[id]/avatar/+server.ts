import type { SupabaseClient } from "@supabase/supabase-js";
import { json } from "@sveltejs/kit";

async function getPersonTeam(person_id, supabase: SupabaseClient): Promise<number | Response> {
    const {data, error} = await supabase.from('people').select("fk_team_id").eq('id', person_id);
    if (error) return json({status: 400, body: 'Błąd - nie można znaleźć jednostki użytkownika'})
    if (!data || data.length == 0) return json({status: 400, body: 'Błąd - nie można znaleźć jednostki użytkownika'})
    return data[0].fk_team_id;
}

export async function POST({ request, params, locals: { supabase } }): Promise<{ status: number, body }> {
    const formData = await request.formData();
    const person_id = params.id;

    const body = Object.fromEntries(formData.entries());
    if (!body) return json({ status: 400, body: 'Błąd wewnętrzny - żądanie jest puste' });
    const file = body.file_to_upload;
    console.log(body);
    if (!(file as File).name
        || (file as File).name === 'undefined') {
        return json({ status: 400, body: 'Błąd - nie wybrano pliku' });
    }
    const team_id = await getPersonTeam(person_id, supabase);
    const { error } = await supabase
        .storage
        .from('avatars')
        .upload(`${team_id}/${person_id}.${(file as File).name.split('.').pop()}`, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: (file as File).type,
        });
    if (error) return json({ status: 500, body: error });
    return json({ status: 200, body: file });
}

export async function DELETE({ params, locals: { supabase } }): Promise<{ status: number, body }> {
    const person_id = params.id;

    const team_id = await getPersonTeam(person_id, supabase);
    const { error } = await supabase
        .storage
        .from('avatars')
        .remove([`${team_id}/${person_id}.*`])
    if (error) return json({status: 500, body: error})
    return json({ status: 204 })
}