import { json } from "@sveltejs/kit";

export async function DELETE({ params, locals: { supabase } }) {
    const group_id = params.id;
    if (!group_id) return json({ status: 300, body: 'Błąd wewnętrzny - żądanie jest puste' });
    const { error } = await supabase.from('small_groups').delete().eq('id', parseInt(group_id)).select();
    if (error) return json({ status: 500, body: error });
    return json({ status: 204 });
}

export async function PUT({ request, params, locals: { getSession, supabase } }) {

    const session = await getSession();
    if (!session?.user) return json({ status: 401, body: 'Użytkownik niezalogowany - odśwież sesję' });
    //TODO: it's ugly, refactor it
    //TODO: Implement handle of 401

    const { data: people, error: error3 } = await supabase
        .from('people')
        .select('fk_team_id')
        .eq('fk_user_id', session?.user?.id);
    if (error3) return json({ status: 500, body: error3 });
    if (!people || people.length === 0) return json({ status: 401, body: 'User not logged in' });

    const group_id = params.id;
    const formData = await request.formData();
    const { error } = await supabase.from('group_person').delete().eq('fk_small_group_id', parseInt(group_id)).select();
    if (error) return json({ status: 500, body: error });
    const members = formData.getAll('people');
    for (let i = 0; i < members.length; i++) {
        const { error } = await supabase.from('group_person').insert([{ fk_small_group_id: parseInt(group_id), fk_person_id: parseInt(members[i].toString()) }]);
        if (error) return json({ status: 500, body: error });
    }
    const data = {
        id: parseInt(group_id),
        name: formData.get('name').toString(),
        description: formData.get('desc')?.toString() || null,
        is_formal: formData.get('is_formal')?.toString() === 'on' ? true : false,
        fk_team_id: people[0].fk_team_id,
    }
    if (!data.name) return json({ status: 400, body: 'Nazwa jest wymagana' });
    const { error: error2 } = await supabase.from('small_groups').upsert(data).select();
    if (error2) return json({ status: 500, body: error2 });
    return json({ status: 200, body: data });
}   