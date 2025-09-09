import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, UserRound, CalendarCheck2, PlusCircle, BarChart3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";





export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-foreground">
      <div className="flex">
        
        <div className="flex-1 min-w-0">
         
          <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
