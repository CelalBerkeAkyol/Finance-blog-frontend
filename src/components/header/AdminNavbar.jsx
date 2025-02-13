import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <Navbar className="border-b-1 bg-gray-800 text-white">
      <NavbarContent className="w-full " justify="center">
        <NavbarItem>
          <Link to="/blog-admin/dashboard">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/blog-admin/posts">Posts</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/blog-admin/post/new">New Post</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
