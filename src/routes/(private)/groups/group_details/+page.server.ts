import { getPicturesList } from '$lib/server/getPicturesList';
import { redirect } from '@sveltejs/kit';

async function getPeople(supabase) {
	const { data: people, error: db_error } = await supabase.from('people').select(`
  id, name, roles (id, name, color), degrees (id, name, color), small_groups (id, name), join_year`);
	if (db_error) throw db_error;
	return people;
}

async function getGroup(group_id: string | null, supabase) {
	if (!group_id) return {};
	const { data: small_groups, error } = await supabase
		.from('small_groups')
		.select('id, name, description, is_formal')
		.eq('id', group_id);
	if (error) throw error;
	return small_groups[0] || null;
}
async function getGroupPerson(group_id: string | null, supabase) {
	if (!group_id) return {};
	const { data: group_person, error } = await supabase
		.from('group_person')
		.select('*')
		.eq('fk_small_group_id', group_id);
	if (error) throw error;
	return group_person || [];
}

export async function load({ url, locals: { supabase, getSession } }) {
	const group_id = url.searchParams.get('id');
	const group = await getGroup(group_id, supabase);
	const people = await getPeople(supabase);
	const group_person = await getGroupPerson(group_id, supabase);
	const picturesList = await getPicturesList(supabase, getSession);

	if (!group && group_id) {
		throw redirect(302, '/groups');
	}
	return { group, people, group_person, streamed: { picturesList } };
}
