import { redirect } from '@sveltejs/kit';

async function getFinance(finance_id: string | null, supabase) {
    if (!finance_id) return {};
    const { data: finance, error } = await supabase
        .from('finance_history')
        .select('*')
        .eq('id', parseInt(finance_id));
    if (error) throw error;
    if (!finance || finance.length === 0) return null;
    if (finance[0].fk_fee) return null;
    return finance[0];
}

async function getCategories(supabase) {
    const { data: categories, error } = await supabase
        .from('finance_categories')
        .select('id, name, color');
    if (error) throw error;
    return categories || [];
}

export async function load({ url, locals: { supabase } }) {
    const finance_id = url.searchParams.get('id');
    const finance = await getFinance(finance_id, supabase);
    const categories = await getCategories(supabase);
    if (!finance && finance_id) {
        throw redirect(302, '/finance');
    }
    return { finance, categories };
}
