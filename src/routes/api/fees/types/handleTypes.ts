import { json } from "@sveltejs/kit";

function validation(body) {
    if (!body) return json({ status: 400, body: 'Błąd wewnętrzny - żądanie jest puste' });
    if (!body.name) return json({ status: 400, body: 'Nazwa jest wymagana' });
    if (!body.date) return json({ status: 400, body: 'Data jest wymagana' });
    if (body.is_formal === 'on' && body.small_group !== '') return json({ status: 400, body: 'Składka roczna nie może być przypisana do grupy' });
    if (body.count_finance === 'on' && body.amount !== '') return json({ status: 400, body: 'Kwota jest wymagana' });
    return null;
}

export async function handleTypes(formData:Promise<FormData>) {
    const formData1 = await formData;
    let body;
    try {
        console.log('formData', formData1);
        body = Object.fromEntries(formData1.entries());
    } catch (error) {
        console.log(error);
        return json({ status: 400, body: 'Błąd wewnętrzny - żądanie jest puste lub błędne.' });
    }

    const validated = validation(body);
    if (validated) return validated;

    const amount = parseFloat(body.amount.toString().replace(',', '.'));

    const data = {
        name: body.name.toString(),
        amount: amount,
        fk_small_group_id: parseInt(body.small_group.toString()),
        count_finance: body.count_finance === 'on' ? true : false,
        is_formal: body.is_formal === 'on' ? true : false,
        start_date: body.date.toString(),
        created_at: undefined,
    };

    return data;
}