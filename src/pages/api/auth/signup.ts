import { signUp } from "@/scripts/supabaseClient"
import { APIRoute } from "astro"

export const prerender = false;


interface RequestData {
    name: string
    email: string
    password: string
    password_confirm: string
}



export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData()


    // Convert formData into a plain object
    const formObject = Object.fromEntries(formData) as {
        [key: string]: FormDataEntryValue;
    };

    // Ensure the formObject has the expected types
    const { name, email, password, password_confirm }: RequestData = {
        name: formObject.name as string,
        email: formObject.email as string,
        password: formObject.password as string,
        password_confirm: formObject.password_confirm as string,
    };

    if (!email || !password || !name || !password_confirm) {
        return new Response(null, {
            status: 400,
            headers: { 'content-type': 'application/json' },
            statusText: "Missing filed"
        });
    }

    if (password !== password_confirm) {
        const responseMessage = "password mismatch"
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/signup?message="${encodeURIComponent(responseMessage)}"`,
            },
        })
    }

    const { error } = await signUp(email, password, name)

    if (error) {
        console.log("🚀 ~ constPOST:APIRoute= ~ error:", error)
        return new Response(error.message, {
            status: 500,
        });
    }

    return Response.redirect("/signin")
}