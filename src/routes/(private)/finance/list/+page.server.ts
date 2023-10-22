export async function load({ locals: { supabase } }) {
    const { data: operations } = await supabase.from("finance_history").select(
        `id, name, amount, finance_categories (name, color), fk_fee, date, invoice_number`).order('date', { ascending: false });
    return { operations };
}