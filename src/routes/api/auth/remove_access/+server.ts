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

	const formData = await request.formData();
	const email = formData.get('email').toString();
	const user_id = formData.get('id').toString();

	//Validate email
	if (!email) return json({ status: 400, body: 'Email jest wymagany' });
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		return json({ status: 400, body: 'Email jest niepoprawny' });

	const { data, error } = await supabaseService.auth.admin.inviteUserByEmail(email, {
		// redirect to this URL, but with ending /invited after email confirmation,
		redirectTo: `http://localhost:5173/invited`
		// TODO: here goes production and development URLs
	});
	if (error) return json({ status: 500, body: error });

	const { data: data2, error: error2 } = await supabase
		.from('people')
		.update({ fk_user_id: data.user.id, admin_since: new Date().toUTCString() })
		.eq('id', user_id)
		.select();
	if (error2) return json({ status: 500, body: error2 });

	return json({ status: 200, body: data2 });
}
