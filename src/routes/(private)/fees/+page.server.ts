
export async function load({ locals: { supabase }, url }) {
  const { data: fees_types, error: db_error1 } = await supabase
    .from("fees_types").select(`
  id, name, amount, small_groups (id, name)`);
  if (db_error1) throw db_error1;

  const group_id = url.searchParams.get("id");
  
  let people;
  if (group_id) {
    const { data: people1, error: db_error } = await supabase
      .from("fees_people")
      .select(`*`).eq("group_person_group_id", group_id);
      people = people1;
      if (db_error) throw db_error; 
  }
  people = people || [];
  return { people, fees_types };
}
