// This file intentionally omits "use server" so the browser receives Set-Cookie.
// Same-origin `/api/v1` → Next rewrites to the backend; HttpOnly cookie is stored for this site.

import { getApiV1Base } from "@/lib/apiBaseUrl";

export async function loginAction(email, password) {
  try {
    const res = await fetch(`${getApiV1Base()}/admin/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
      // Required to send/receive cookies for HttpOnly authentication
      credentials: "include"
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to login");
    }

    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function signupAction(userData) {
    try {
        const res = await fetch(`${getApiV1Base()}/admin/auth/register`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData),
          credentials: "include"
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to register");
        }
    
        return await res.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function logoutAction() {
    try {
        const res = await fetch(`${getApiV1Base()}/admin/auth/logout`, {
          method: "POST",
          credentials: "include"
        });
        return await res.json();
      } catch (error) {
        return { success: false, message: error.message };
      }
}
