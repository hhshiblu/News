import NavbarClient from "./NavbarClient";

/** Categories are loaded once in `(public)/layout.jsx` and passed in. */
export default function Navbar({ navCategories = [] }) {
  return <NavbarClient initialCategories={navCategories} />;
}
