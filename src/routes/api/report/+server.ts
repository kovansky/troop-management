import { json } from "@sveltejs/kit";

export async function GET({ request, locals: { getSession, supabase } }): Promise<{ status: number, body }> {
    const session = await getSession();
    if (!session?.user) return json({ status: 401, body: 'Użytkownik niezalogowany - odśwież sesję' });
    //TODO: it's ugly, refactor it
    //TODO: Implement handle of 401

    const { data: operations, error } = await supabase.from("finance_history").select(
        `name, amount, finance_categories (name), date`).order('date', { ascending: true });
    if (error) return json({ status: 500, body: error });
    return json({ status: 200, body: operations });
  }