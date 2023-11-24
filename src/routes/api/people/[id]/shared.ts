export async function getPersonTeam(person_id: string | null, supabase) {
	const { data, error } = await supabase.from('people').select('fk_team_id').eq('id', person_id);
	if (error) throw error;
	if (!data || data.length == 0) return [];
	return data[0].fk_team_id;
}