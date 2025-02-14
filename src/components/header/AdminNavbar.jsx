import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminNavbar() {
  // Redux'taki user slice'tan veriyi çekelim
  const { userInfo, isAdmin } = useSelector((state) => state.user);

  // userInfo?.userName veya userInfo?.name şeklinde olabilir.
  const userName = userInfo?.userName || "Guest";
  // Rolü “admin” olarak göstermek istersek:
  const userRole = isAdmin ? "Admin" : "User";

  return (
    <Navbar className="border-b-1 bg-gray-800 text-white">
      <NavbarContent className="w-full " justify="center">
        <NavbarItem>
          <Link to="/dashboard/home">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/posts">Posts</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/post/new">New Post</Link>
        </NavbarItem>
      </NavbarContent>

      {/* Navbar'ın sağ tarafı */}
      <NavbarContent justify="end">
        <NavbarItem className="pr-4">
          {/* Örnek: “CBA - Admin” ya da “Guest - User” */}
          {`${userName} - ${userRole}`}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
