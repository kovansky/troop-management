import { json } from '@sveltejs/kit';

export async function POST({
	request,
	locals: { getSession, supabaseService, supabase, getServiceSession }
}): Promise<{ status: number; body }> {
	const session = await getSession();
	const serviceSession = await getServiceSession();
	if (!session?.user)
		return json({ status: 401, body: 'Użytkownik niezalogowany - odśwież sesję' });
	if (!serviceSession?.user?.role)
		return json({ status: 401, body: 'Użytkownik niezalogowany - odśwież sesję' });
	//TODO: it's ugly, refactor it
	//TODO: Implement handle of 401

	const { id } = await request.json();

	const { data, error } = await supabase.from('people').select('fk_user_id').eq('id', id);
	if (error) return json({ status: 500, body: error });

	if (!data[0]) return json({ status: 404, body: 'Nie znaleziono użytkownika' });
	if (data.length > 1) return json({ status: 500, body: 'Błąd bazy danych' });

	const { data: data2, error: error2 } = await supabaseService.auth.admin.deleteUser(data[0].fk_user_id);
	if (error2) return json({ status: 500, body: error2 });

	return json({ status: 200, body: data2 });
}
