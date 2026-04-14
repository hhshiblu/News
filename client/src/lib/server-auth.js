import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function getMe() {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${BACKEND_URL}/admin/auth/me`, {
            headers: {
                Cookie: cookieStore.toString()
            },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (e) {
        return null;
    }
}
