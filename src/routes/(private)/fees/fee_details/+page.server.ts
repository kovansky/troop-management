
export async function load({ locals: { supabase } }) {
  const { data: fees_types, error: db_error1 } = await supabase
    .from("fees_types").select(`
  id, name, amount, small_groups (id, name)`);
  if (db_error1) throw db_error1;

    const { data: people, error: db_error } = await supabase
      .from("fees_people")
      .select(`*`);
      if (db_error) throw db_error; 

  return { people, fees_types };
}
