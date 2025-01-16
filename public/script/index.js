import { supabase } from "../../lib/supabaseClient";
import Profile from "../../src/pages/profile.astro";


  // SIGN-IN
  
  const signin = document.getElementById("signin-form");
  
  if (signin) {
    console.log(signin);
    signin.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("signin-email").value;
      const password = document.getElementById("signin-password").value;
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      console.log(data);
// Wait for session persistence
const { data: session } = await supabase.auth.getSession();
console.log("Session after sign-in:", session);

if (session?.session) {
  alert("Signin successful!");
  window.location.href = /profile;
} else {
  console.error("Failed to establish session after sign-in.");
}

if (error) {
  alert(Error: ${error.message});
}
});
} else {
console.error("Signin form not found!");
}

