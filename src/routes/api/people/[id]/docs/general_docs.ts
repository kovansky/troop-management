import { getPersonTeam } from '../shared';

async function getFiles(person_id: string, supabase, team_id: string) {
    const { data: files, error } = await supabase.storage
    .from('personal_files')
    .list(`${team_id}/${person_id}`);
    if (error) return { status: 500, body: error };
    return files;
}

export async function general_post({
	request,
	params,
	locals: { supabase },
    type
}) {
	const formData = await request.formData();
	const person_id = params.id;

	const body = Object.fromEntries(formData.entries());
	if (!body) return { status: 400, body: 'Błąd wewnętrzny - żądanie jest puste' };
	const file = body[type];

	if (!(file as File).name || (file as File).name === 'undefined') {
		return { status: 400, body: 'Błąd - nie wybrano pliku' };
	}
	const team_id = await getPersonTeam(person_id, supabase);
	const { error } = await supabase.storage
		.from('personal_files')
		.upload(`${team_id}/${person_id}/${type}.${(file as File).name.split('.').pop()}`, file, {
			cacheControl: '3600',
			upsert: true,
			contentType: (file as File).type
		});
	if (error) return { status: 500, body: error };
	return { status: 200, body: file };
}

export async function general_delete({ params, locals: { supabase }, type }) {
	const person_id = params.id;

	const team_id = await getPersonTeam(person_id, supabase);
    const files = await getFiles(person_id, supabase, team_id);
    if (files.status) return files;
    const file = files.filter((file) => file.name.startsWith(type));
    if (file.length == 0) return { status: 404, body: 'Nie znaleziono plików' };
    const { error } = await supabase.storage.from('personal_files').remove([`${team_id}/${person_id}/${file[0].name}`]);
	if (error) return { status: 500, body: error };
	return  { status: 204 };
}

export async function general_get({ params, locals: { supabase }, type }) {
    const person_id = params.id;
    const team_id = await getPersonTeam(person_id, supabase);
    const files = await getFiles(person_id, supabase, team_id);
    if (files.status) return files;
    const file = files.filter((file) => file.name.startsWith(type));
    if (file.length == 0) return { status: 404, body: 'Nie znaleziono plików' };
    const { data, error } = await supabase.storage
    .from('personal_files')
    .createSignedUrl(`${team_id}/${person_id}/${file[0].name}`, 60);
    if (error) return { status: 500, body: error };
    return { status: 200, body: data.signedUrl };
}