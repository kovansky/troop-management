export async function load({ locals: { supabase } }) {
    const { data: year_earnings } = await supabase.rpc('get_year_earnings');
    const { data: year_expenses } = await supabase.rpc('get_year_expenses');
    const { data: team_money } = await supabase.rpc('get_team_money');
    const { data: year_count } = await supabase.rpc('get_year_count');
    const { data: last_operations } = await supabase.from("finance_history").select(
        `id, name, amount, finance_categories (name, color), fk_fee, date`).limit(4).order('date', { ascending: false });
    const { data: categories_chart } = await supabase.rpc('calculate_finance_summary');


    return { year_earnings, year_expenses, team_money, year_count, last_operations, categories_chart };
  }