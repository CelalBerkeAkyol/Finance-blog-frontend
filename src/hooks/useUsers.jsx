import { useState, useEffect, useMemo } from "react";
import axios from "../api";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rowsPerPage = 10;

  // Verileri çek
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/user", { withCredentials: true });
      setUsers(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Kullanıcılar yüklenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtrelenmiş kullanıcılar (arama için)
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (user) =>
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Custom hook geriye döndürülen değerler
  return {
    users,
    setUsers,
    filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    rowsPerPage,
    fetchUsers,
  };
}
