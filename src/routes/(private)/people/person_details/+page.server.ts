import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { getPersonTeam } from '../../../api/people/[id]/shared';

async function getPerson(person_id: string | null, supabase) {
	if (!person_id) return {};
	const { data: person, error } = await supabase
		.from('people')
		.select('*')
		.eq('id', parseInt(person_id));
	if (error) throw error;
	if (!person || person.length === 0) return null;
	const addressParts = person[0].address?.split(',').map((part) => part.trim()) || [];
	return {
		...person[0],
		city: addressParts.pop() || null,
		address: addressParts.join(', ') || null
	};
}

async function getGroups(supabase) {
	const { data: small_groups, error } = await supabase
		.from('small_groups')
		.select('id, name')
		.eq('is_formal', true);
	if (error) throw error;
	return small_groups || [];
}

async function getDegrees(supabase) {
	const { data: degrees, error } = await supabase.from('degrees').select('id, name, color');
	if (error) throw error;
	return degrees || [];
}

async function getRoles(supabase) {
	const { data: roles, error } = await supabase.from('roles').select('id, name, color');
	if (error) throw error;
	return roles || [];
}

async function getPicture(person_id: string | null, supabase: SupabaseClient) {
	if (!person_id) return null;
	const team_id = await getPersonTeam(person_id, supabase);
	const { data: picture, error } = await supabase.storage
		.from('avatars')
		.createSignedUrl(`${team_id}/${person_id}.jpg`, 60);
	if (error?.message == 'Object not found') return null;
	if (error) throw error;
	const testUrl = await fetch(picture.signedUrl);
	if (testUrl.status == 404) return null;
	return picture.signedUrl;
}

async function getDocs(person_id: string | null, supabase: SupabaseClient) {
	if (!person_id) return null;
	const team_id = await getPersonTeam(person_id, supabase);
	const { data: files, error } = await supabase.storage
		.from('personal_files')
		.list(`${team_id}/${person_id}`);
	if (error) throw error;
	return {
		declaration: files.some((file) => file.name.startsWith('declaration')),
		agreement: files.some((file) => file.name.startsWith('agreement'))
	};
}
export async function load({ url, locals: { supabase } }) {
	const person_id = url.searchParams.get('id');
	const person = await getPerson(person_id, supabase);
	const groups = await getGroups(supabase);
	const degrees = await getDegrees(supabase);
	const roles = await getRoles(supabase);
	if (!person && person_id) {
		throw redirect(302, '/people');
	}
	const picture = await getPicture(person_id, supabase);
	const docs = await getDocs(person_id, supabase);
	return { streamed: { person, groups, degrees, roles, picture, docs: docs } };
}
