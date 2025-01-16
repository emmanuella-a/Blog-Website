---
import { supabase } from "../scripts/supabaseClient";

let errorMessage = "";
let successMessage = "";

// Check if user is already signed in
const {
  data: { user },
} = await supabase.auth.getUser();
if (user) {
  return Astro.redirect("/home");
}

// Handle form submission
if (Astro.request.method === "POST") {
  try {
    const formData = await Astro.request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const rememberMe = formData.get("remember-me") === "on";

    if (!email || !password) {
      errorMessage = "Email and password are required";
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Set session duration based on remember me checkbox
          expiresIn: rememberMe ? "30d" : "1h",
        },
      });

      if (error) {
        errorMessage = error.message;
      } else {
        return Astro.redirect("/home");
      }
    }
  } catch (e) {
    console.error("Error processing form:", e);
    errorMessage = "An error occurred while processing your request";
  }
}
---