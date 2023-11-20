import { json } from "@sveltejs/kit";

export async function PUT({ request, locals: {supabase} }): Promise<{ status: number, body }> {

    const body = await request.json();
    if (!body) return json({ status: 400, body: 'Błąd wewnętrzny - żądanie jest puste' });
    // person_id, fee_type_id
    const { personIdFee, fees_types_id } = body;

    const { error } = await supabase.rpc('changefeestatus', {
        fee_type_id: fees_types_id,
        person_id: personIdFee
    });
    if (error) return json({ status: 500, body: error.message });
    return json({ status: 200 });
}