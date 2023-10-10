import { json } from "@sveltejs/kit";

export async function POST({ request, locals: { getSession, supabaseService, supabase, getServiceSession } }): Promise<{ status: number, body }> {
       //TODO: it's ugly, refactor it
    //TODO: Implement handle of 401

    const formData = await request.formData();
    const token = formData.get('token').toString();
    const refreshToken = formData.get('refresh_token').toString();
    const password = formData.get('password').toString();

    const { data: data3, error: error3 } = await supabase.auth.setSession({access_token: token, refresh_token: refreshToken});
    if (error3) return json({ status: 500, body: error3 });
    console.log(data3);
    // log user in with the token
    
    const { data, error } = await supabase.auth.updateUser({password: password})
    if (error) return json({ status: 500, body: error });
    console.log(data);


    return json({ status: 200 });
    
}

