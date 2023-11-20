import { json } from '@sveltejs/kit';

export async function POST({
	request,
	locals: { getSession, supabase }
}): Promise<{ status: number; body }> {
	const session = await getSession();
	if (!session?.user)
		return json({ status: 401, body: 'Użytkownik niezalogowany - odśwież sesję' });
	//TODO: it's ugly, refactor it
	//TODO: Implement handle of 401

	const { data: people, error: error3 } = await supabase
		.from('people')
		.select('fk_team_id')
		.eq('fk_user_id', session?.user?.id);
	if (error3) return json({ status: 500, body: error3 });
	if (!people || people.length === 0) return json({ status: 401, body: 'User not logged in' });

	const formData = await request.formData();
	const data = {
		name: formData.get('name').toString(),
		description: formData.get('desc')?.toString() || null,
		is_formal: formData.get('is_formal')?.toString() === 'on' ? true : false,
		fk_team_id: people[0].fk_team_id
	};
	if (!data.name) return json({ status: 400, body: 'Nazwa jest wymagana' });
	const { data: small_groups, error: error2 } = await supabase
		.from('small_groups')
		.upsert(data)
		.select();
	if (error2) return json({ status: 500, body: error2 });

	const members = formData.getAll('people');
	for (let i = 0; i < members.length; i++) {
		const { error } = await supabase
			.from('group_person')
			.insert([
				{ fk_small_group_id: small_groups[0].id, fk_person_id: parseInt(members[i].toString()) }
			]);
		if (error) return json({ status: 500, body: error });
	}
	return json({ status: 200, body: data });
}
