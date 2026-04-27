import { Toaster } from "sonner";

/** Standalone auth screens (no public site navbar/footer). */
export default function AuthLayout({ children }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
