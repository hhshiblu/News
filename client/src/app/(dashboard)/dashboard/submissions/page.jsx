import { cookies } from "next/headers";
import SubmissionsClient from "./SubmissionsClient";

export default async function SubmissionsPage() {
    let submissions = [];
    try {
        const cookieStore = await cookies();
        const res = await fetch("http://localhost:5000/api/v1/admin/submissions", {
            headers: { Cookie: cookieStore.toString() },
            cache: "no-store",
        });
        if(res.ok) {
            const data = await res.json();
            submissions = data.submissions || [];
        }
    } catch(err) {
        console.error("Networking error getting submissions", err);
    }

    return <SubmissionsClient initialSubmissions={submissions} />;
}
