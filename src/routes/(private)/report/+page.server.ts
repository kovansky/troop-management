export async function load({ locals: { supabase } }) {
	const { data: team, error } = await supabase
		.from('teams')
		.select(`name, logo_url`)
		.limit(1);
    if (error) throw error;
	return {
		team_name: team[0].name,
        team_logo_url: team[0].logo_url
	};
}
