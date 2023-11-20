import { redirect } from '@sveltejs/kit';

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

export async function getPicturesList(supabase, getSession) {
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