import type { APIRoute } from "astro";
import { signIn, supabase } from "../../../scripts/supabaseClient";





export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
      });
    }

    const { data, error } = await signIn(email, password)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
      });
    }

    const { access_token, refresh_token } = data.session!;
    cookies.set("sb-access-token", access_token, {
      path: "/",
    });
    cookies.set("sb-refresh-token", refresh_token, {
      path: "/",
    });
    return redirect("/dashboard");


  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
    });
  }
};
