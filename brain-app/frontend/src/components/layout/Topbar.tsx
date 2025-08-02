import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card">
      <h1 className="ml-24 text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search your saved content..."
            className="pl-10 w-96 mr-24 flex items-center"
          />
        </div>
      </div>
    </header>
  );
}
