import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">FinAI</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Link to="/blog-admin/dashboard">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/blog/posts/">Blogs</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/blog/posts/">Blogs</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
