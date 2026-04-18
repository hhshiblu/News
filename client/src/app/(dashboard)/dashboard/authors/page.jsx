import { cookies } from "next/headers";
import AuthorsClient from "./AuthorsClient";

export default async function AuthorsManagementPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams?.status || 'ALL';

  const queryParams = new URLSearchParams();
  queryParams.append('roleIn', 'AUTHOR,REPORTER,RESEARCH_AUTHOR');
  
  if (statusFilter !== 'ALL') {
      queryParams.append('status', statusFilter);
  }

  let authors = [];

  try {
      const cookieStore = await cookies();
      const res = await fetch(`http://localhost:5000/api/v1/admin/users?${queryParams.toString()}`, {
          headers: { Cookie: cookieStore.toString() },
          cache: 'no-store'
      });
             
      if(res.ok) {
          const data = await res.json();
          authors = data.data || [];
      }
  } catch (e) {
      console.error("Failed fetching authors for Admin Dash:", e.message);
  }

  return (
      <AuthorsClient initialAuthors={authors} filterParam={statusFilter} />
  );
}
