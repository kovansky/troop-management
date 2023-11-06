import { redirect } from '@sveltejs/kit';

async function getSmallGroups(supabase) {
  const { data: small_groups, error } = await supabase
    .from('small_groups')
    .select('id, name');
  if (error) throw error;
  return small_groups || [];
}

async function getFeesType(fee_type_id, supabase) {
  if (!fee_type_id) return {};
  const { data: fees_types, error } = await supabase
    .from('fees_types')
    .select('*')
    .eq('id', parseInt(fee_type_id));
  if (error) throw error;
  if (!fees_types || fees_types.length === 0) return null;
  return fees_types[0];
}

export async function load({ url, locals: { supabase } }) {
    console.log('url', url);
    const fee_type = await getFeesType(url.searchParams.get('id'), supabase);
    const small_groups = await getSmallGroups(supabase);
    if (!fee_type) {
        throw redirect(302, '/fees');
    }
    return { fee_type, small_groups };
}
