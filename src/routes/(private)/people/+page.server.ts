import { getPicturesList } from '$lib/server/getPicturesList';

export async function load({ locals: { supabase, getSession } }) {
	const { data: people, error: db_error } = await supabase.from('people').select(`
  id, name, roles (id, name, color), degrees (id, name, color), small_groups (id, name), join_year, fk_team_id, fk_user_id`);
	if (db_error) throw db_error;

	const picturesList = await getPicturesList(supabase, getSession);

	return { people, streamed: { picturesList } };
}
