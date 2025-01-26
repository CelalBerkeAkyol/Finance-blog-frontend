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
    <Navbar className="border-b-1">
      <NavbarContent className="w-full gap-6" justify="center">
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
