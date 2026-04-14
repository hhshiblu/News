// This file intentionally omits "use server" to ensure that the browser handles 
// the HttpOnly cookie returned by the backend directly, avoiding server-to-server 
// cookie stripping issues in Next.js Server Actions.

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function loginAction(email, password) {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/auth/login`, {
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
        const res = await fetch(`${BACKEND_URL}/admin/auth/register`, {
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
        const res = await fetch(`${BACKEND_URL}/admin/auth/logout`, {
          method: "POST",
          credentials: "include"
        });
        return await res.json();
      } catch (error) {
        return { success: false, message: error.message };
      }
}
