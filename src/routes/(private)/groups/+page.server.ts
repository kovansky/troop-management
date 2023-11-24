export async function load({ locals: { supabase } }) {
	const { data: groups, error } = await supabase.from('small_groups').select('*');
	if (error) throw error;
	return { groups };
}
