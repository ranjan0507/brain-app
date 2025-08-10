import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-neutral-800 bg-[#090909]">
          {/* placeholder topbar area if needed */}
        </div>
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
