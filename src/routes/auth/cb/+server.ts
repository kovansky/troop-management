import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	if ((await supabase.auth.getSession()).data) {
		throw redirect(307, '/dashboard');
	}

	throw redirect(307, '/');
};
