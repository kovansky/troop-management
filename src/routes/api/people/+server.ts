import { json } from "@sveltejs/kit";

function validatePerson(body) {
    if (!body.full_name) return json({ status: 400, body: 'Imię i nazwisko jest wymagane' });
    if (body.pesel && !/^\d{11}$/.test(body.pesel)) return json({ status: 400, body: 'Pesel jest niepoprawny' });
    if (body.parent_phone && !/^\d{9}$/.test(body.parent_phone)) return json({ status: 400, body: 'Numer telefonu rodzica jest niepoprawny' });
    if (body.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.parent_email)) return json({ status: 400, body: 'Email rodzica jest niepoprawny' });
    return null;
}

async function updateInsertPerson(body, { locals: { supabase, getSession } }) {
    const session = await getSession();
    if (!session?.user) return json({ status: 401, body: 'Użytkownik niezalogowany - odśwież sesję' });
    //TODO: it's ugly, refactor it
    //TODO: Implement handle of 401

    const data = {
        name: body.full_name.toLowerCase(),
        address: body.address ? `${body.address}, ${body.city}` : undefined,
        pesel: body.pesel || undefined,
        parent_phone: body.parent_phone || undefined,
        parent_email: body.parent_email || undefined,
        parent_name: body.parent_name || undefined,
        admin_since: undefined,
        created_at: undefined,
        fk_creator_id: undefined,
        fk_degree_id: body.fk_degree_id || null,
        fk_role_id: body.fk_role_id || null,
        fk_small_group_id: body.fk_small_group_id || null,
        fk_user_id: undefined,
        id: body.id || undefined,
        join_year: undefined
    };
    console.log('data', data);
    if (!body.id) {
        console.log('inserting');
        const { data: person, error: db_error } = await supabase.from('people').insert(data).select();
        if (db_error) return json({ status: 500, body: db_error });
        console.log('saved ',person);
        console.log(db_error)
        return json({ status: 201, body: person });
    } else {
        console.log('updating');
        const { data: person, error: db_error } = await supabase.from('people').upsert(data).select();
        if (db_error) return json({ status: 500, body: db_error });
        return json({ status: 200, body: person });
    }

}
//TODO: maybe save current user id in cookie?

export async function POST({ request, locals }): Promise<{ status: number, body }> {
    const formData = await request.formData();
    const person_id = formData.get('id');

    const body = Object.fromEntries(formData.entries());
    if (!body) return json({ status: 400, body: 'Błąd wewnętrzny - żądanie jest puste' });
    const validation = validatePerson(body);
    if (validation) return validation;

    const newBody = {
        id: person_id ? parseInt(person_id.toString()) : null,
        full_name: body.full_name,
        address: body.address,
        city: body.city,
        pesel: body.pesel,
        parent_phone: body.parent_phone,
        parent_email: body.parent_email,
        parent_name: body.parent_name,
        fk_degree_id: parseInt(body.degree.toString()),
        fk_role_id: parseInt(body.role.toString()),
        fk_small_group_id: parseInt(body.group.toString()),
    };
    return await updateInsertPerson(newBody, { locals });

}