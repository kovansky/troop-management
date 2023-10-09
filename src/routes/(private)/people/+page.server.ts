export async function load({ locals: { supabase } }) {
  //Load people
  const { data: people, error: db_error } = await supabase.from("people").select(`
  id, name, roles (id, name, color), degrees (id, name, color), small_groups (id, name), join_year`);
  if (db_error) throw db_error;
  return { people };
}