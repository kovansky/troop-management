import { json } from "@sveltejs/kit";
import { handleTypes } from "./handleTypes";

export async function POST({ request, locals: {supabase} }): Promise<{ status: number, body }> {
    
    const data = await handleTypes(request.formData());
    if ('status' in data) {
        return data;
    }

    const {data: fee, error} = await supabase.from('fees_types').insert(data).select();
    if (error) return json({ status: 500, body: error.message });
    return json({ status: 200, body: fee });
}