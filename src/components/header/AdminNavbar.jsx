import React from "react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <Navbar className="border-b-1 bg-gray-800 text-white">
      <NavbarContent className="w-full gap-5" justify="start">
        <NavbarItem>
          <Link to="/dashboard/home">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/posts">Posts List</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/post/new">New Post</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/gallery">Gallery</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/cheat-sheet">Cheat Sheet</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
