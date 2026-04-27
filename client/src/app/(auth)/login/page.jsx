import { redirect } from "next/navigation";
import { getMe } from "@/lib/server-auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in — LabourPulse",
  description: "Editorial dashboard sign-in for LabourPulse authors and administrators.",
};

export default async function LoginPage() {
  const user = await getMe();
  if (user) redirect("/dashboard");

  return <LoginForm />;
}
