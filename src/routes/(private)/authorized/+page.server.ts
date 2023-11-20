import { getPicturesList } from '$lib/server/getPicturesList';

export async function load({ locals: { supabase, getSession } }) {
	const selectData = ` id, name, roles (id, name, color), degrees (id, name, color), small_groups (id, name), join_year, fk_user_id`;
	const { data: peopleUid, error: db_error } = await supabase
		.from('people')
		.select(selectData)
		.not('fk_user_id', 'is', null);
	const { data: peopleRole, error: db_error1 } = await supabase
		.from('people')
		.select(selectData)
		.not('roles', 'is', null)
		.eq('roles.is_admin', true);
	let people = peopleUid.concat(peopleRole);
	people = people.filter(
		(person, index, self) => index === self.findIndex((t) => t.id === person.id)
	);
	if (db_error) throw db_error;
	if (db_error1) throw db_error1;

	const picturesList = await getPicturesList(supabase, getSession);

	return { people, streamed: { picturesList } };
}
