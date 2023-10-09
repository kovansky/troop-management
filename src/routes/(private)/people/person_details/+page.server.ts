import { redirect } from '@sveltejs/kit';

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
        address: addressParts.join(', ') || null,
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
    const { data: degrees, error } = await supabase
        .from('degrees')
        .select('id, name, color');
    if (error) throw error;
    return degrees || [];
}

async function getRoles(supabase) {
    const { data: roles, error } = await supabase
        .from('roles')
        .select('id, name, color');
    if (error) throw error;
    return roles || [];
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
    return { streamed: { person, groups, degrees, roles } };
}
