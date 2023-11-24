import { json } from '@sveltejs/kit';

export async function POST({
	request,
	locals: { getSession, supabaseService, supabase, getServiceSession }
}): Promise<{ status: number; body }> {
	//TODO: it's ugly, refactor it
	//TODO: Implement handle of 401

	const formData = await request.formData();
	const accessToken = formData.get('access_token').toString();
	const refreshToken = formData.get('refresh_token').toString();
	const token = formData.get('token').toString();
	const password = formData.get('password').toString();

	if (!token) {
		if (!accessToken) return json({ status: 400, body: 'Brak tokenu' });
		if (!refreshToken) return json({ status: 400, body: 'Brak tokenu odświeżającego' });
		const { error: error3 } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});
		if (error3) return json({ status: 500, body: error3 });
	} else {
		const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: 'recovery' });
		if (error) return json({ status: 500, body: error });
	}

	if (!password) return json({ status: 400, body: 'Nie podano hasła' });

	const { error } = await supabase.auth.updateUser({ password: password });
	if (error) return json({ status: 500, body: error });

	return json({ status: 200 });
}
