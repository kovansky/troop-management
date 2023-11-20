import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase } }): Promise<{ status: number; body }> {
	const { error } = await supabase.auth.signOut();
	if (error) {
		return json({ status: 500, body: error.message });
	}
	return json({ status: 200, body: 'success' });
}
