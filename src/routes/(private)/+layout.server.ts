import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw redirect(303, '/auth');

	const { data, error } = await locals.supabase
		.from('people')
		.select('name, roles (name, color)')
		.eq('fk_user_id', session.user.id)
		.single();
	if (error) return { status: 500, error: error.message };
	return { status: 200, user: data };
};
