// src/components/Sidebar.tsx
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <aside className="bg-neutral-900 text-white w-64 h-screen p-4 flex flex-col border-r border-neutral-800">
      <h1 className="text-2xl font-bold text-purple-400 mb-6">My Dashboard</h1>
      <nav className="flex-1 space-y-3">
        <Link to="/" className="block hover:text-purple-400">Dashboard</Link>
        <Link to="/add-link" className="block hover:text-purple-400">Add Link</Link>
      </nav>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white mt-auto"
      >
        Logout
      </button>
    </aside>
  );
}
