async function getCurrentUserTeam(supabase, getSession) {
	const session = await getSession();
	if (!session) throw redirect(303, '/auth');
	const { data: team, error } = await supabase
		.from('people')
		.select('fk_team_id')
		.eq('fk_user_id', session.user.id);
	if (error) throw error;
	if (!team || team.length == 0) return null;
	return team[0].fk_team_id;
}

async function getPicturesList(supabase, getSession) {
	const team_id = await getCurrentUserTeam(supabase, getSession);
	const { data: pictures, error } = await supabase.storage.from('avatars').list(team_id.toString());
	if (pictures.length == 0) return [];
	if (error) throw error;

	const { data: urls, error: urls_error } = await supabase.storage.from('avatars').createSignedUrls(
		pictures.map((picture) => team_id + '/' + picture.name),
		60
	);
	if (urls_error) throw urls_error;

	const picturesList = await pictures.map((picture, index) => {
		return {
			...picture,
			url: urls[index]
		};
	});
	return picturesList;
}

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
